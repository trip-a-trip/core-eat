import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '&app/user/domain/user.entity';

@Controller('/v1')
export class StatisticsController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Get('/count')
  async getCount() {
    const count = await this.userRepo.count();

    return { count };
  }
}
