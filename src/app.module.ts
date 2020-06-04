import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from './external/config.module';
import { VenueChoicer } from './core/domain/VenueChoicer';
import { Historian } from './core/domain/Historian';
import { typeOrmProvider } from './external/typeOrmProvider';
import { Venue } from './core/domain/Venue.entity';
import { Seen } from './core/domain/Seen.entity';
import { VenueFinder } from './core/infrastructure/VenueFinder';
import { VenueController } from './core/presentation/http/VenueController';
import { SeenFinder } from './core/infrastructure/SeenFinder';
import { HistoryController } from './core/presentation/http/HistoryController';
import { VenueCreator } from './core/application/VenueCreator';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forFeature([Venue, Seen]),
  ],
  controllers: [VenueController, HistoryController],
  providers: [VenueChoicer, Historian, VenueFinder, VenueCreator, SeenFinder],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
