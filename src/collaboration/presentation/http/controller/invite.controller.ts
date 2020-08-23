import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { TransformInterceptor } from '&app/lib/nest';
import { Initiator } from '&app/collaboration/application/initiator';
import { Invite } from '&app/collaboration/domain/invite.entity';

import { ApplyInviteCodeRequest } from '../request/apply_invite_code_request';
import { CreateForUserRequest } from '../request/create_for_user_request';

@Controller('/v1/invite')
@UseInterceptors(TransformInterceptor)
@ApiTags('invite')
export class InviteController {
  constructor(private readonly initiator: Initiator) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'Invite created', type: Invite })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'User can not invite other users' })
  async getInvite(@Body() { userId }: CreateForUserRequest) {
    const invite = await this.initiator.getNewInvite(userId);

    return invite;
  }

  @Post('apply')
  @ApiCreatedResponse({ description: 'User invited as collaborator ' })
  @ApiBadRequestResponse({ description: 'Invite already used' })
  @ApiNotFoundResponse({ description: 'Invitation not found' })
  @ApiConflictResponse({ description: 'User is already collaborator ' })
  async applyInviteCode(@Body() { code, userId }: ApplyInviteCodeRequest) {
    await this.initiator.addNewCollaborator(code, userId);
  }
}
