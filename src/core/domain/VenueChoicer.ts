import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';
import { getDistance } from 'geolib';

import { Coordinates } from './Coordinates';
import { Venue } from './Venue.entity';
import { Seen } from './Seen.entity';

const DISTANCE_THRESHOLD_IN_METERS = 2000;

@Injectable()
export class VenueChoicer {
  async choice(
    userId: string,
    coordinates: Coordinates,
  ): Promise<Venue | null> {
    const venues: Venue[] = []; // TODO: get from db
    const seenToday: Seen[] = []; // TODO: get from db

    const haveNotSeenVenue = this.findVenue(coordinates, venues, seenToday);
    if (haveNotSeenVenue) {
      return haveNotSeenVenue;
    }

    return this.findVenue(coordinates, venues);
  }

  private findVenue(
    coordinates: Coordinates,
    venues: Venue[],
    seenVenues: Seen[] = [],
  ): Venue | null {
    return (
      chain(venues)
        .filter((venue) => this.filterByDistance(venue, coordinates))
        .differenceWith(seenVenues, (venue, seen) => venue.id === seen.venueId)
        .sortBy((venue) => venue.isAmazing)
        .sortBy((venue) => getDistance(venue.coordinates!, coordinates))
        // TODO: add filter by time of day
        .first()
        .value()
    );
  }

  private filterByDistance(venue: Venue, coordinates: Coordinates): boolean {
    const venueCoordinates = venue.coordinates;

    if (!venueCoordinates) {
      return false;
    }

    const distance = getDistance(venueCoordinates, coordinates);

    return distance < DISTANCE_THRESHOLD_IN_METERS;
  }
}
