import { NestModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '&app/external/config.module';

import { VenueController } from './presentation/http/venue.controller';
import { VenueChoicer } from './domain/venue_choicer';
import { Historian } from './domain/historian';
import { VenueCreator } from './application/venue_creator';
import { Venue } from './domain/venue.entity';
import { Seen } from './domain/seen.entity';
import { VenueFinder } from './domain/venue_finder';
import { VenueManager } from './application/venue_manager';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Venue, Seen])],
  controllers: [VenueController],
  providers: [VenueChoicer, VenueFinder, VenueManager, Historian, VenueCreator],
  exports: [VenueCreator],
})
export class EatModule implements NestModule {
  configure() {
    // pass
  }
}
