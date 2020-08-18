import { ApiProperty } from '@nestjs/swagger';

export class Coordinates {
  @ApiProperty({ example: 0.1 })
  latitude: number;

  @ApiProperty({ example: 0.2 })
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
