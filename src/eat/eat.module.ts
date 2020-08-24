import { NestModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '&app/external/config.module';

import { VenueController } from './presentation/http/venue.controller';
import { VenueChoicer } from './domain/venue_choicer';
import { Historian } from './domain/historian';
import { VenueCreator } from './application/venue_creator';
import { Venue } from './domain/venue.entity';
import { Seen } from './domain/seen.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Venue, Seen])],
  controllers: [VenueController],
  providers: [VenueChoicer, Historian, VenueCreator],
  exports: [VenueCreator],
})
export class EatModule implements NestModule {
  configure() {
    // pass
  }
}
