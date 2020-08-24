import { NestModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '&app/external/config.module';

import { VenueController } from './presentation/http/VenueController';
import { VenueChoicer } from './domain/VenueChoicer';
import { Historian } from './domain/Historian';
import { VenueFinder } from './infrastructure/VenueFinder';
import { VenueCreator } from './application/VenueCreator';
import { SeenFinder } from './infrastructure/SeenFinder';
import { Venue } from './domain/Venue.entity';
import { Seen } from './domain/Seen.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Venue, Seen])],
  controllers: [VenueController],
  providers: [VenueChoicer, Historian, VenueFinder, VenueCreator, SeenFinder],
  exports: [VenueCreator],
})
export class EatModule implements NestModule {
  configure() {
    // pass
  }
}
