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
} from '@nestjs/common';

import { Coordinates } from '&app/lib/geo';
import { VenueCreator } from '&app/eat/application/venue_creator';
import { VenueChoicer } from '&app/eat/domain/venue_choicer';
import { Historian } from '&app/eat/domain/historian';
import { Venue } from '&app/eat/domain/venue.entity';
import { TransformInterceptor, ParseFloatPipe } from '&app/lib/nest';

@Controller('/v1/venue')
@UseInterceptors(TransformInterceptor)
export class VenueController {
  constructor(
    private readonly creator: VenueCreator,
    private readonly venues: VenueChoicer,
    private readonly history: Historian,
  ) {}

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
