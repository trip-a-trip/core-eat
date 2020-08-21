import { NestModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '&app/external/config.module';

import { StatisticsController } from './presentation/http/statistics.controller';
import { SignUpController } from './presentation/http/sign_up.controller';
import { Registrator } from './application/registrator';
import { User } from './domain/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [SignUpController, StatisticsController],
  providers: [Registrator],
})
export class UserModule implements NestModule {
  configure() {
    // pass
  }
}
