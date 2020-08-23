import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DraftFields } from '@trip-a-trip/lib';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Collaborator } from '../domain/collaborator.entity';
import { PublishToken } from '../domain/publish_token.entity';
import { TaskManager } from './task_manager';

@Injectable()
export class Publisher {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
    @InjectRepository(PublishToken)
    private readonly publishTokenRepo: Repository<PublishToken>,
    private readonly tasks: TaskManager,
  ) {}

  async publishDraft(code: string, fields: DraftFields) {
    const token = await this.publishTokenRepo.findOne(code);

    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    await this.em.transaction(async (em) => {
      const draft = token.apply(fields);

      await Promise.all([em.save(token), em.save(draft)]);

      await this.tasks.requestModeration(draft);
    });
  }

  async getNewToken(userId: string): Promise<PublishToken> {
    const user = await this.collaboratorRepo.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.em.transaction(async (em) => {
      const token = user.createPublishToken();

      await Promise.all([em.save(token), em.save(user)]);

      return token;
    });
  }

  async publishTokenIsValid(code: string): Promise<boolean> {
    const token = await this.publishTokenRepo.findOne(code);

    if (!token) {
      return false;
    }

    return !token.used;
  }
}
