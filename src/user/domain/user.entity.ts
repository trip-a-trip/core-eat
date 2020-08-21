import { Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user_users' })
export class User {
  @PrimaryColumn({ name: 'id' })
  @ApiProperty({ example: 'fdsjhk23' })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
