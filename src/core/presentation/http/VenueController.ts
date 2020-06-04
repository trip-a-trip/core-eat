import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
  ParseArrayPipe,
  Post,
  Body,
} from '@nestjs/common';

import { VenueCreator } from '&app/core/application/VenueCreator';
import { VenueChoicer } from '&app/core/domain/VenueChoicer';
import { Coordinates } from '&app/core/domain/Coordinates';
import { Historian } from '&app/core/domain/Historian';
import { Venue } from '&app/core/domain/Venue.entity';

import { TransformInterceptor } from './TransformInterceptor';
import { ParseFloatPipe } from './ParseFloatPipe';

@Controller('/v1/venue')
@UseInterceptors(TransformInterceptor)
export class VenueController {
  constructor(
    private readonly creator: VenueCreator,
    private readonly venues: VenueChoicer,
    private readonly history: Historian,
  ) {}

  @Post('/')
  @ApiCreatedResponse()
  async create(@Body() draft: Venue) {
    await this.creator.create(draft);
  }

  @Get('/')
  @ApiOkResponse({ type: Venue })
  @ApiQuery({ name: 'skipIds', type: 'string', isArray: true, required: false })
  @ApiNotFoundResponse()
  async get(
    @Query('userId') userId: string,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('skipIds', new ParseArrayPipe({ optional: true }))
    skipIds: string[] = [],
  ) {
    const venue = await this.venues.choice(
      new Coordinates(latitude, longitude),
      skipIds,
    );

    if (!venue) {
      throw new NotFoundException();
    }

    await this.history.addHistory(userId, venue);

    return venue;
  }
}
