import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay, endOfDay } from 'date-fns';

import { Seen } from '../domain/Seen.entity';

@Injectable()
export class HistoryFinder {
  constructor(
    @InjectRepository(Seen)
    private readonly repo: Repository<Seen>,
  ) {}

  async findTodayHistory(userId: string): Promise<Seen[]> {
    const now = new Date();
    const from = startOfDay(now);
    const to = endOfDay(now);

    return this.repo
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.date >= :from', { from })
      .andWhere('s.date <= :to ', { to })
      .getMany();
  }
}
