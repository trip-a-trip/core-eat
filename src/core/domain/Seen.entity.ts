import { Entity, Column } from 'typeorm';

@Entity({ name: 'seen' })
export class Seen {
  @Column({ name: 'venue_id' })
  venueId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'date' })
  date: Date;

  constructor(venueId: string, userId: string, date: Date) {
    this.venueId = venueId;
    this.userId = userId;
    this.date = date;
  }
}
