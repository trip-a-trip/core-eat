import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

import { Venue } from './venue.entity';
import { Seen } from './seen.entity';

@Injectable()
export class Historian {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async addHistory(userId: string, venue: Venue): Promise<void> {
    const seen = new Seen(venue.id, userId, new Date());

    await this.em.insert(Seen, seen);
  }
}
