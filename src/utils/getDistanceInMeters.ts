import geodist from 'geodist';

import { Coordinates } from '&app/core/domain/Coordinates';

export const getDistanceInMeters = (
  one: Coordinates,
  two: Coordinates,
): number =>
  geodist([one.latitude, one.longitude], [two.latitude, two.longitude], {
    unit: 'meters',
  });
