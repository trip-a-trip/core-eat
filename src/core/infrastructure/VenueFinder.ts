import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Venue } from '../domain/Venue.entity';

@Injectable()
export class VenueFinder {
  constructor(
    @InjectRepository(Venue)
    private readonly repo: Repository<Venue>,
  ) {}

  async findAll(): Promise<Venue[]> {
    // TODO: implement
    return [];
  }
}
