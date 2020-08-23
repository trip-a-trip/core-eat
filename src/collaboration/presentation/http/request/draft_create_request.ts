import { Coordinates, VenueKind, Link, DraftFields } from '@trip-a-trip/lib';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DraftCreateRequest implements DraftFields {
  @ApiProperty({ example: 'jkhfkdshk34kjnn' })
  token!: string;

  @ApiProperty({ example: 'Tiger Lily' })
  name!: string;

  @ApiPropertyOptional({ example: 'Лудшие!1' })
  description?: string;

  @ApiProperty({ example: false })
  isExpensive!: boolean;

  @ApiProperty({ example: true })
  isAmazing!: boolean;

  @ApiProperty({
    example: [VenueKind.Lunch, VenueKind.Dinner],
    enum: VenueKind,
    isArray: true,
  })
  kind!: VenueKind[];

  @ApiPropertyOptional({ example: 'Петербург, Итальянская' })
  address?: string | undefined;

  @ApiPropertyOptional({ example: { longitude: 12.1, latitude: 11.2 } })
  coordinates!: Coordinates;

  @ApiPropertyOptional({
    example: [{ title: 'Instagram', url: 'https://insta.example' }],
    isArray: true,
  })
  links!: Link[];
}
