import { NestModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import {
  MODERATION_REQUEST_QUEUE,
  MODERATION_NOTIFY_QUEUE,
  REVIEW_REQUEST_QUEUE,
  REVIEW_NOTIFY_QUEUE,
} from '@trip-a-trip/lib';

import { ConfigModule } from '&app/external/config.module';
import { bullProvider } from '&app/external/bullProvider';

import { PublishToken } from './domain/publish_token.entity';
import { Collaborator } from './domain/collaborator.entity';
import { Invite } from './domain/invite.entity';
import { Draft } from './domain/draft.entity';
import { TaskManager } from './application/task_manager';
import { Publisher } from './application/publisher';
import { Initiator } from './application/initiator';
import { Moderator } from './application/moderator';
import { CollaboratorController } from './presentation/http/controller/collaborator.controller';
import { InviteController } from './presentation/http/controller/invite.controller';
import { PublicationController } from './presentation/http/controller/publication.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Collaborator, Draft, Invite, PublishToken]),
    BullModule.registerQueueAsync(
      bullProvider(MODERATION_REQUEST_QUEUE),
      bullProvider(MODERATION_NOTIFY_QUEUE),
      bullProvider(REVIEW_REQUEST_QUEUE),
      bullProvider(REVIEW_NOTIFY_QUEUE),
    ),
  ],
  controllers: [
    CollaboratorController,
    InviteController,
    PublicationController,
  ],
  providers: [TaskManager, Publisher, Initiator, Moderator],
})
export class CollaborationModule implements NestModule {
  configure() {
    // pass
  }
}
