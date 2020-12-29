import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { VenueFinder } from '../domain/venue_finder';
import { Venue } from '../domain/venue.entity';

@Injectable()
export class VenueManager {
  constructor(
    private readonly finder: VenueFinder,
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async delete(venue: Venue) {
    venue.disable();

    await this.em.save(venue);
  }
}
