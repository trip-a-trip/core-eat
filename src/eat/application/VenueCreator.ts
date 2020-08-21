import { InjectEntityManager } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Venue } from '../domain/Venue.entity';

@Injectable()
export class VenueCreator {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async create(draft: object) {
    const venue = plainToClass(Venue, draft);

    await this.em.save(venue);
  }
}
