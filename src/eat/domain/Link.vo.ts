import { ApiProperty } from '@nestjs/swagger';

export class Link {
  @ApiProperty({ example: 'site' })
  title: string;

  @ApiProperty({ example: 'https://my-cafe.ru' })
  url: string;

  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}
