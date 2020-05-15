import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from './external/config.module';
import { VenueChoicer } from './core/domain/VenueChoicer';
import { Historian } from './core/domain/Historian';
import { typeOrmProvider } from './external/typeOrmProvider';
import { Venue } from './core/domain/Venue.entity';
import { Seen } from './core/domain/Seen.entity';
import { HistoryFinder } from './core/infrastructure/HistoryFinder';
import { VenueFinder } from './core/infrastructure/VenueFinder';
import { VenueController } from './core/presentation/http/VenueController';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forFeature([Venue, Seen]),
  ],
  controllers: [VenueController],
  providers: [VenueChoicer, Historian, HistoryFinder, VenueFinder],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
