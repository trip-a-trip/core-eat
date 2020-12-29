import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
  ApiNoContentResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
  ParseArrayPipe,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Body,
} from '@nestjs/common';

import { Coordinates } from '&app/lib/geo';
import { VenueChoicer } from '&app/eat/domain/venue_choicer';
import { Historian } from '&app/eat/domain/historian';
import { Venue } from '&app/eat/domain/venue.entity';
import { TransformInterceptor, ParseFloatPipe } from '&app/lib/nest';
import { VenueFinder } from '&app/eat/domain/venue_finder';
import { VenueManager } from '&app/eat/application/venue_manager';

@Controller('/v1/venue')
@ApiTags('venue')
@UseInterceptors(TransformInterceptor)
export class VenueController {
  constructor(
    private readonly venues: VenueChoicer,
    private readonly history: Historian,
    private readonly finder: VenueFinder,
    private readonly manager: VenueManager,
  ) {}

  @Get('/list')
  @ApiOkResponse({ type: Venue, isArray: true })
  async list() {
    const venues = await this.finder.findAll();

    return venues;
  }

  @Get('/:id')
  @ApiOkResponse({ type: Venue })
  @ApiNotFoundResponse()
  async get(@Param('id') id: string) {
    const venue = await this.finder.findOne(id);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string) {
    const venue = await this.finder.findOne(id);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.manager.delete(venue);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async edit(@Param('id') id: string, @Body() patch: Venue) {
    const venue = await this.finder.findOne(id);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.manager.edit(venue, patch);
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
