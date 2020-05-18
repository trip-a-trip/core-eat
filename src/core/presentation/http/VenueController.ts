import { ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { Coordinates } from '&app/core/domain/Coordinates';
import { VenueChoicer } from '&app/core/domain/VenueChoicer';
import { Historian } from '&app/core/domain/Historian';
import { Venue } from '&app/core/domain/Venue.entity';

import { ParseFloatPipe } from './ParseFloatPipe';
import { TransformInterceptor } from './TransformInterceptor';

@Controller('/v1/venue')
@UseInterceptors(TransformInterceptor)
export class VenueController {
  constructor(
    private readonly venues: VenueChoicer,
    private readonly history: Historian,
  ) {}

  @Get('/')
  @ApiOkResponse({ type: Venue })
  @ApiNotFoundResponse()
  async get(
    @Query('userId') userId: string,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    const venue = await this.venues.choice(
      new Coordinates(latitude, longitude),
    );

    if (!venue) {
      throw new NotFoundException();
    }

    await this.history.addHistory(userId, venue);

    return venue;
  }
}
