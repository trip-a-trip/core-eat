import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';
import { getTimes } from 'suncalc';
import { differenceInMinutes } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VenueKind } from '@trip-a-trip/lib';

import { getDistanceInMeters, Coordinates } from '&app/lib/geo';
import { getAverage } from '&app/lib/math';

import { Venue } from './venue.entity';

const DISTANCE_THRESHOLD_IN_METERS = 2000;
const AMAZING_MULTIPILER = 1.5;
const EXPENSIVE_MULTIPILER = 0.8;
const NO_REAL_EAT_MULTIPILER = 0.7;

@Injectable()
export class VenueChoicer {
  constructor(
    @InjectRepository(Venue)
    private readonly repo: Repository<Venue>,
  ) {}

  async choice(
    coordinates: Coordinates,
    skipIds: string[],
  ): Promise<Venue | null> {
    const venues = await this.repo.find();

    const fitVenues = this.getFitVenues(coordinates, venues, skipIds);

    return chain(fitVenues)
      .chunk(Math.ceil(fitVenues.length / 2))
      .first()
      .sample()
      .value();
  }

  private getFitVenues(
    coordinates: Coordinates,
    venues: Venue[],
    skipIds: string[],
  ): Venue[] {
    return chain(venues)
      .differenceWith(skipIds, (venue, skipId) => venue.id === skipId)
      .filter((venue) => this.filterByDistance(venue, coordinates))
      .filter((venue) => this.filterByTimeOfDay(venue, coordinates))
      .sortBy((venue) => this.getProductivity(venue, coordinates))
      .value();
  }

  private getProductivity(venue: Venue, coordinates: Coordinates): number {
    const baseProductivity =
      DISTANCE_THRESHOLD_IN_METERS -
      getDistanceInMeters(venue.coordinates, coordinates);

    const amazingMultiplier = venue.isAmazing ? AMAZING_MULTIPILER : 1;
    const expensiveMultiplier = venue.isExpensive ? EXPENSIVE_MULTIPILER : 1;
    const onlyBiteDrinkMultiplier = venue.kind.every(
      (kind) => kind === VenueKind.BiteDrink,
    )
      ? NO_REAL_EAT_MULTIPILER
      : 1;

    const multilier = [
      amazingMultiplier,
      expensiveMultiplier,
      onlyBiteDrinkMultiplier,
    ].reduce((acc, curr) => acc * curr, -1);

    return baseProductivity * multilier;
  }

  private filterByTimeOfDay(venue: Venue, coordinates: Coordinates): boolean {
    const kinds = new Set();
    kinds.add(VenueKind.BiteDrink);

    const now = new Date();
    const times = getTimes(now, coordinates.latitude, coordinates.longitude);

    const normalizeTiming = (timing: Date) => {
      const diff = Math.abs(differenceInMinutes(now, timing));

      return Number.isNaN(diff) ? Number.MAX_SAFE_INTEGER : diff;
    };

    const toMorning = getAverage(
      normalizeTiming(times.dawn),
      normalizeTiming(times.goldenHourEnd),
    );
    const toNoon = getAverage(
      normalizeTiming(times.solarNoon),
      normalizeTiming(times.goldenHour),
    );
    const toEvening = getAverage(
      normalizeTiming(times.dusk),
      normalizeTiming(times.night),
    );

    if (toMorning <= toNoon && toMorning <= toEvening) {
      kinds.add(VenueKind.Breakfast);
    }
    if (toNoon <= toMorning && toNoon <= toEvening) {
      kinds.add(VenueKind.Lunch);
    }
    if (toEvening <= toMorning && toEvening <= toNoon) {
      kinds.add(VenueKind.Dinner);
    }

    return venue.kind.some((kind) => kinds.has(kind));
  }

  private filterByDistance(venue: Venue, coordinates: Coordinates): boolean {
    return (
      getDistanceInMeters(venue.coordinates, coordinates) <
      DISTANCE_THRESHOLD_IN_METERS
    );
  }
}
