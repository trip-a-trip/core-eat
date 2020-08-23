import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { EatClient } from '@trip-a-trip/lib';
import uid from 'uid';

import { Draft } from '../domain/draft.entity';
import { TaskManager } from './task_manager';

@Injectable()
export class Moderator {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(Draft)
    private readonly draftRepo: Repository<Draft>,
    private readonly tasks: TaskManager,
    private readonly eat: EatClient,
  ) {}

  async approve(draftId: string, moderatorId: string) {
    const draft = await this.draftRepo.findOne(draftId);

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    draft.approve(moderatorId);

    await this.em.transaction(async (em) => {
      await em.save(draft);

      await Promise.all([
        this.tasks.notifyAboutModeration(draft),
        this.eat.createVenue({
          ...draft.fields,
          id: uid(20),
          authorId: draft.authorId,
        }),
      ]);
    });
  }

  async decline(draftId: string, moderatorId: string) {
    const draft = await this.draftRepo.findOne(draftId);

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    draft.decline(moderatorId);

    await this.em.transaction(async (em) => {
      await em.save(draft);

      await this.tasks.notifyAboutModeration(draft);
    });
  }
}
