import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PublishToken } from './publish_token.entity';
import { Invite } from './invite.entity';

@Entity({ name: 'collaboration_collaborators' })
export class Collaborator {
  @PrimaryColumn({ name: 'user_id' })
  @ApiProperty({ example: 'fdsfds' })
  readonly userId: string;

  @Column({ name: 'sponsor_id' })
  @Exclude()
  readonly sponsorId: string;

  @Column({ name: 'invited_at' })
  @Exclude()
  readonly invitedAt: Date;

  @Column({ name: 'rating' })
  @ApiProperty({ example: 12 })
  rating: number = 0;

  @Expose()
  @ApiProperty({ example: true })
  get canInvite() {
    return this.rating >= Invite.COST;
  }

  @Expose()
  @ApiProperty({ example: false })
  get canPublish() {
    return this.rating >= PublishToken.RATING_THRESHOLD;
  }

  constructor(userId: string, sponsorId: string, invitedAt: Date) {
    this.userId = userId;
    this.sponsorId = sponsorId;
    this.invitedAt = invitedAt;
  }

  createInvite(): Invite {
    if (!this.canInvite) {
      throw new BadRequestException('User can not invite other');
    }

    this.rating -= Invite.COST;

    return new Invite(this.userId);
  }

  createPublishToken(): PublishToken {
    if (!this.canPublish) {
      throw new BadRequestException(
        'User can not create drafts, rating to low',
      );
    }

    return new PublishToken(this.userId);
  }
}
