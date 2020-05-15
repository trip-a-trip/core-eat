import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Seen } from '../domain/Seen.entity';

@Injectable()
export class HistoryFinder {
  constructor(
    @InjectRepository(Seen)
    private readonly repo: Repository<Seen>,
  ) {}

  async findTodayHistory(userId: string): Promise<Seen[]> {
    // TODO: implement
    return [];
  }
}
