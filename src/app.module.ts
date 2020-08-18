import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EatModule } from './eat/eat.module';
import { typeOrmProvider } from './external/typeOrmProvider';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmProvider), EatModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
