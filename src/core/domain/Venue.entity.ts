import { VenueKind } from './VenueKind';
import { Coordinates } from './Coordinates';

export class Venue {
  id: string;

  name: string;

  description?: string;

  isExpensive: boolean = false;

  isAmazing: boolean = false;

  kind: VenueKind[] = [];

  address?: string;

  get coordinates(): Coordinates | null {
    if (!this.latitude || !this.longitude) {
      return null;
    }

    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  private latitude?: number;

  private longitude?: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
