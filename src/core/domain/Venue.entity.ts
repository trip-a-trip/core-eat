import { Entity, PrimaryColumn, Column } from 'typeorm';

import { Coordinates } from './Coordinates';
import { VenueKind } from './VenueKind';

@Entity('venues')
export class Venue {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description?: string;

  @Column({ name: 'is_expensive' })
  isExpensive: boolean = false;

  @Column({ name: 'is_amazing' })
  isAmazing: boolean = false;

  @Column({ name: 'kind', type: 'array' })
  kind: VenueKind[] = [];

  @Column({ name: 'address' })
  address?: string;

  get coordinates(): Coordinates {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  @Column({ name: 'latitude' })
  private latitude: number;

  @Column({ name: 'longitude' })
  private longitude: number;

  constructor(id: string, name: string, latitude: number, longitude: number) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
