import { ApiProperty } from '@nestjs/swagger';

export class ModerationRequest {
  @ApiProperty({ example: 'fdsfjsld3' })
  moderatorId!: string;

  @ApiProperty({ example: true })
  approved!: boolean;

  @ApiProperty({ example: 'fdsfljsl23' })
  draftId!: string;
}
