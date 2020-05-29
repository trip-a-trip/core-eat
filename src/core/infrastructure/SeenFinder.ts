import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Interval } from 'date-fns';

import { Seen } from '../domain/Seen.entity';

@Injectable()
export class SeenFinder {
  constructor(
    @InjectRepository(Seen)
    private readonly repo: Repository<Seen>,
  ) {}

  async findInInterval(interval: Interval): Promise<Seen[]> {
    const history = await this.repo
      .createQueryBuilder()
      .where('date >= :start')
      .andWhere('date <= :end')
      .orderBy('date', 'DESC')
      .setParameters({
        start: new Date(interval.start).toISOString(),
        end: new Date(interval.end).toISOString(),
      })
      .getMany();

    return history;
  }
}
