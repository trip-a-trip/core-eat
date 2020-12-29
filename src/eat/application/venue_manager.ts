/* eslint-disable no-param-reassign */
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

  async edit(venue: Venue, patch: Venue) {
    venue.name = patch.name;
    venue.description = patch.description;
    venue.isExpensive = patch.isExpensive;
    venue.isAmazing = patch.isAmazing;
    venue.kind = patch.kind;
    venue.address = patch.address;
    venue.coordinates = patch.coordinates;
    venue.links = patch.links;
    venue.authorId = patch.authorId;

    await this.em.save(venue);
  }
}
