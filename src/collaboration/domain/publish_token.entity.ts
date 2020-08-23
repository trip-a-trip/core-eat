import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DraftFields } from '@trip-a-trip/lib';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import uid from 'uid';

import { Draft } from './draft.entity';

@Entity({ name: 'publish_tokens' })
export class PublishToken {
  static RATING_THRESHOLD = -5;

  @PrimaryColumn({ name: 'token' })
  @ApiProperty({ example: 'fsdkljasjlm' })
  readonly token: string;

  @Column({ name: 'user_id' })
  @Exclude()
  readonly userId: string;

  @Column({ name: 'used' })
  @Exclude()
  used: boolean = false;

  constructor(userId: string) {
    this.token = uid(20);
    this.userId = userId;
  }

  apply(fields: DraftFields): Draft {
    if (this.used) {
      throw new ForbiddenException('Used token');
    }

    this.used = true;

    return new Draft(fields, this.userId);
  }
}
