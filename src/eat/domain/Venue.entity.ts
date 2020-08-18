import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column } from 'typeorm';

import { Coordinates } from '&app/lib/geo';

import { VenueKind } from './VenueKind';
import { Link } from './Link.vo';

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

  @Column({ name: 'kind', type: 'varchar', array: true })
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

  set coordinates(coordinates: Coordinates) {
    this.latitude = coordinates.latitude;
    this.longitude = coordinates.longitude;
  }

  @Column({ name: 'latitude' })
  @Exclude()
  private latitude: number;

  @Column({ name: 'longitude' })
  @Exclude()
  private longitude: number;

  @Column({ name: 'links', type: 'jsonb' })
  @ApiProperty({ type: Link, isArray: true })
  @Type(() => Link)
  readonly links: Link[] = [];

  @Column({ name: 'author_id', type: 'varchar' })
  @ApiProperty({ example: 'efkl5645m' })
  readonly authorId: string | null = null;

  constructor(id: string, name: string, latitude: number, longitude: number) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
