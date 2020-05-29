import { Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'seen' })
export class Seen {
  @PrimaryColumn({ name: 'venue_id' })
  @ApiProperty({ example: 'fdsjhk23' })
  venueId: string;

  @PrimaryColumn({ name: 'user_id' })
  @ApiProperty({ example: 'jkhcuybq' })
  userId: string;

  @PrimaryColumn({ name: 'date' })
  @ApiProperty({ example: new Date() })
  date: Date;

  constructor(venueId: string, userId: string, date: Date) {
    this.venueId = venueId;
    this.userId = userId;
    this.date = date;
  }
}
