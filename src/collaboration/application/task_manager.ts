import {
  MODERATION_REQUEST_QUEUE,
  MODERATION_NOTIFY_QUEUE,
} from '@trip-a-trip/lib';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Draft } from '../domain/draft.entity';

@Injectable()
export class TaskManager {
  constructor(
    @InjectQueue(MODERATION_REQUEST_QUEUE)
    private readonly moderationRequestQueue: Queue<Draft>,
    @InjectQueue(MODERATION_NOTIFY_QUEUE)
    private readonly moderationNotifyQueue: Queue<Draft>,
  ) {}

  async requestModeration(draft: Draft) {
    await this.moderationRequestQueue.add(draft);
  }

  async notifyAboutModeration(draft: Draft) {
    await this.moderationNotifyQueue.add(draft);
  }

  async requestReview(collaboratorId: string) {
    // TODO: implement
    throw new Error('not inplemented');
  }

  async notifyAboutReview(review: any) {
    // TODO: implement
    throw new Error('not inplemented');
  }
}
