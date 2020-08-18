import { Controller, UseInterceptors, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

import { TransformInterceptor, ParseDatePipe } from '&app/lib/nest';
import { SeenFinder } from '&app/eat/infrastructure/SeenFinder';
import { Seen } from '&app/eat/domain/Seen.entity';

@Controller('/v1/history')
@UseInterceptors(TransformInterceptor)
export class HistoryController {
  constructor(private readonly finder: SeenFinder) {}

  @Get('/')
  @ApiOkResponse({ type: Seen, isArray: true })
  @ApiQuery({ name: 'from', type: 'string' })
  @ApiQuery({ name: 'to', type: 'string' })
  async get(
    @Query('from', ParseDatePipe) start: Date,
    @Query('to', ParseDatePipe) end: Date,
  ) {
    const seen = await this.finder.findInInterval({ start, end });

    return seen;
  }
}
