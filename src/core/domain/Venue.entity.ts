import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column } from 'typeorm';

import { Coordinates } from './Coordinates';
import { VenueKind } from './VenueKind';

@Entity('venues')
export class Venue {
  @PrimaryColumn({ name: 'id' })
  @ApiProperty({ example: 'gfdfdg4532' })
  id: string;

  @Column({ name: 'name' })
  @ApiProperty({ example: 'Tiger Lily' })
  name: string;

  @Column({ name: 'description' })
  @ApiPropertyOptional({ example: 'Паназия' })
  description?: string;

  @Column({ name: 'is_expensive' })
  @ApiProperty({ example: false })
  isExpensive: boolean = false;

  @Column({ name: 'is_amazing' })
  @ApiProperty({ example: true })
  isAmazing: boolean = false;

  @Column({ name: 'kind', type: 'jsonb' })
  @ApiProperty({
    example: [VenueKind.Lunch, VenueKind.Dinner, VenueKind.BiteDrink],
    enum: Object.values(VenueKind),
    isArray: true,
  })
  kind: VenueKind[] = [];

  @Column({ name: 'address' })
  @ApiPropertyOptional({ example: 'Питер, Итальянская' })
  address?: string;

  @ApiProperty({ type: Coordinates })
  @Expose()
  get coordinates(): Coordinates {
    return new Coordinates(this.latitude, this.longitude);
  }

  @Column({ name: 'latitude' })
  @Exclude()
  private latitude: number;

  @Column({ name: 'longitude' })
  @Exclude()
  private longitude: number;

  constructor(id: string, name: string, latitude: number, longitude: number) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
