import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import uid from 'uid';

import { Collaborator } from './collaborator.entity';

@Entity({ name: 'collaboration_invites' })
export class Invite {
  static COST = 50;

  @PrimaryColumn({ name: 'code' })
  @ApiProperty({ example: 'INVITE_green_city_kkj43' })
  readonly code: string;

  @Column({ name: 'author_id' })
  @Exclude()
  readonly authorId: string;

  @Column({ name: 'used' })
  @Exclude()
  used: boolean = false;

  constructor(authorId: string) {
    this.code = `INVITE_${uid(20)}`;
    this.authorId = authorId;
  }

  apply(targetUserId: string): Collaborator {
    if (this.used) {
      throw new BadRequestException('Invite already used');
    }

    this.used = true;

    return new Collaborator(targetUserId, this.authorId, new Date());
  }
}
