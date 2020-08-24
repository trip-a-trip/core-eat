import { ApiProperty } from '@nestjs/swagger';
import { Link as BaseLink } from '@trip-a-trip/lib';

export class Link implements BaseLink {
  @ApiProperty({ example: 'site' })
  title: string;

  @ApiProperty({ example: 'https://my-cafe.ru' })
  url: string;

  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}
