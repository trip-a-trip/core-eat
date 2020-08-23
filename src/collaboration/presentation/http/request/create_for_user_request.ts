import { ApiProperty } from '@nestjs/swagger';

export class CreateForUserRequest {
  @ApiProperty({ example: 'dfsdjh3254cs' })
  userId!: string;
}
