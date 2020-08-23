import { ApiProperty } from '@nestjs/swagger';

export class ApplyInviteCodeRequest {
  @ApiProperty({ example: 'INVITE_red_dog_12dd3' })
  code!: string;

  @ApiProperty({ example: 'dfsdjh3254cs' })
  userId!: string;
}
