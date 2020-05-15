import { Injectable } from '@nestjs/common';

import { Venue } from './Venue.entity';
import { Seen } from './Seen.entity';

@Injectable()
export class Historian {
  async addHistory(userId: string, venue: Venue): Promise<void> {
    const seen = new Seen(venue.id, userId, new Date());

    // TODO: save
  }
}
