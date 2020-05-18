import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';
import { getDistance } from 'geolib';
import { getTimes } from 'suncalc';
import { differenceInMinutes } from 'date-fns';

import { Coordinates } from './Coordinates';
import { Venue } from './Venue.entity';
import { VenueFinder } from '../infrastructure/VenueFinder';
import { VenueKind } from './VenueKind';
import { HistoryFinder } from '../infrastructure/HistoryFinder';
import { Seen } from './Seen.entity';

const DISTANCE_THRESHOLD_IN_METERS = 2000;

@Injectable()
export class VenueChoicer {
  constructor(
    private readonly store: VenueFinder,
    private readonly history: HistoryFinder,
  ) {}

  async choice(
    userId: string,
    coordinates: Coordinates,
    useHistory?: boolean,
  ): Promise<Venue | null> {
    const [venues, seen] = await Promise.all([
      this.store.findAll(),
      useHistory ? this.history.findTodayHistory(userId) : [],
    ]);

    return this.findVenue(coordinates, venues, seen);
  }

  private findVenue(
    coordinates: Coordinates,
    venues: Venue[],
    seen: Seen[],
  ): Venue | null {
    return chain(venues)
      .differenceWith(seen, (venue, { venueId }) => venue.id === venueId)
      .filter((venue) => this.filterByDistance(venue, coordinates))
      .filter((venue) => this.filterByTimeOfDay(venue, coordinates))
      .sortBy((venue) => this.getProductivity(venue, coordinates))
      .first()
      .value();
  }

  private getProductivity(venue: Venue, coordinates: Coordinates): number {
    const baseProductivity =
      DISTANCE_THRESHOLD_IN_METERS -
      getDistance(venue.coordinates, coordinates);
    const amazingMultiplier = venue.isAmazing ? 2 : 1;
    const expensiveMultiplier = venue.isExpensive ? 0.8 : 1;

    return baseProductivity * amazingMultiplier * expensiveMultiplier;
  }

  private filterByTimeOfDay(venue: Venue, coordinates: Coordinates): boolean {
    const kinds = new Set(VenueKind.BiteDrink);

    const now = new Date();
    const times = getTimes(now, coordinates.latitude, coordinates.longitude);

    const toMorning =
      Math.abs(differenceInMinutes(now, times.dawn)) +
      Math.abs(differenceInMinutes(now, times.goldenHourEnd)) / 2;
    const toNoon =
      Math.abs(differenceInMinutes(now, times.solarNoon)) +
      Math.abs(differenceInMinutes(now, times.goldenHour)) / 2;
    const toEventing =
      Math.abs(differenceInMinutes(now, times.dusk)) +
      Math.abs(differenceInMinutes(now, times.night)) / 2;

    if (toMorning >= toNoon && toMorning >= toEventing) {
      kinds.add(VenueKind.Breakfast);
    }
    if (toNoon >= toMorning && toNoon >= toEventing) {
      kinds.add(VenueKind.Lunch);
    }
    if (toEventing >= toMorning && toEventing >= toNoon) {
      kinds.add(VenueKind.Dinner);
    }

    return venue.kind.some((kind) => kinds.has(kind));
  }

  private filterByDistance(venue: Venue, coordinates: Coordinates): boolean {
    return (
      getDistance(venue.coordinates, coordinates) < DISTANCE_THRESHOLD_IN_METERS
    );
  }
}
