import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { Invite } from '../domain/invite.entity';
import { Collaborator } from '../domain/collaborator.entity';

@Injectable()
export class Initiator {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    @InjectRepository(Collaborator)
    private readonly collaboratorRepo: Repository<Collaborator>,
  ) {}

  async getNewInvite(userId: string): Promise<Invite> {
    const collaborator = await this.collaboratorRepo.findOne(userId);

    if (!collaborator) {
      throw new NotFoundException('User not found');
    }

    return this.em.transaction(async (em) => {
      const invite = collaborator.createInvite();

      await Promise.all([em.save(collaborator), em.save(invite)]);

      return invite;
    });
  }

  async addNewCollaborator(inviteCode: string, userId: string): Promise<void> {
    const [invite, existCollaborator] = await Promise.all([
      this.inviteRepo.findOne(inviteCode),
      this.collaboratorRepo.findOne(userId),
    ]);

    if (existCollaborator) {
      throw new ConflictException('User already is collaborator');
    }
    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    await this.em.transaction(async (em) => {
      const collaborator = invite.apply(userId);

      await Promise.all([em.save(invite), em.save(collaborator)]);
    });
  }
}
