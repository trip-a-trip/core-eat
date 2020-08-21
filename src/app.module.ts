import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EatModule } from './eat/eat.module';
import { typeOrmProvider } from './external/typeOrmProvider';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmProvider), EatModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
