import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Venue } from './venue.entity';

@Injectable()
export class VenueFinder {
  constructor(
    @InjectRepository(Venue)
    private readonly repo: Repository<Venue>,
  ) {}

  async findOne(id: string): Promise<Venue | null> {
    const venue = await this.repo.findOne(id);

    return venue ?? null;
  }

  async findAll(): Promise<Venue[]> {
    const venues = await this.repo.find();

    return venues;
  }
}
