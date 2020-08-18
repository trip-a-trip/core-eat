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

import { Coordinates } from '&app/lib/geo';
import { VenueCreator } from '&app/eat/application/VenueCreator';
import { VenueChoicer } from '&app/eat/domain/VenueChoicer';
import { Historian } from '&app/eat/domain/Historian';
import { Venue } from '&app/eat/domain/Venue.entity';
import { TransformInterceptor, ParseFloatPipe } from '&app/lib/nest';

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
