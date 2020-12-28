import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
  ParseArrayPipe,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Coordinates } from '&app/lib/geo';
import { VenueChoicer } from '&app/eat/domain/venue_choicer';
import { Historian } from '&app/eat/domain/historian';
import { Venue } from '&app/eat/domain/venue.entity';
import { TransformInterceptor, ParseFloatPipe } from '&app/lib/nest';

@Controller('/v1/venue')
@ApiTags('venue')
@UseInterceptors(TransformInterceptor)
export class VenueController {
  constructor(
    private readonly venues: VenueChoicer,
    private readonly history: Historian,
    @InjectRepository(Venue)
    private readonly repo: Repository<Venue>,
  ) {}

  @Get('/list')
  @ApiOkResponse({ type: Venue, isArray: true })
  async list() {
    const venues = await this.repo.find();

    return venues;
  }

  @Get('/:id')
  @ApiOkResponse({ type: Venue })
  @ApiNotFoundResponse()
  async get(@Param('id') id: string) {
    const venue = await this.repo.findOne(id);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  @Get('/')
  @ApiOkResponse({ type: Venue })
  @ApiQuery({ name: 'skipIds', type: 'string', isArray: true, required: false })
  @ApiNotFoundResponse()
  async choice(
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
