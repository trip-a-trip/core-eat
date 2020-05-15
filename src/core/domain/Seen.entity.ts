export class Seen {
  venueId: string;

  userId: string;

  date: Date;

  constructor(venueId: string, userId: string, date: Date) {
    this.venueId = venueId;
    this.userId = userId;
    this.date = date;
  }
}
