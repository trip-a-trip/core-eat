import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from './external/config.module';
import { VenueChoicer } from './core/domain/VenueChoicer';
import { Historian } from './core/domain/Historian';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [VenueChoicer, Historian],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
