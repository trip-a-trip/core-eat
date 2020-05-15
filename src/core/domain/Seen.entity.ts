import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'seen' })
export class Seen {
  @PrimaryColumn({ name: 'venue_id' })
  venueId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'date' })
  date: Date;

  constructor(venueId: string, userId: string, date: Date) {
    this.venueId = venueId;
    this.userId = userId;
    this.date = date;
  }
}
