import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { TransformInterceptor } from '&app/lib/nest';
import { Publisher } from '&app/collaboration/application/publisher';
import { Moderator } from '&app/collaboration/application/moderator';
import { PublishToken } from '&app/collaboration/domain/publish_token.entity';

import { CreateForUserRequest } from '../request/create_for_user_request';
import { DraftCreateRequest } from '../request/draft_create_request';
import { ModerationRequest } from '../request/moderation_request';

@Controller('v1/publication')
@UseInterceptors(TransformInterceptor)
@ApiTags('publication')
export class PublicationController {
  constructor(
    private readonly publisher: Publisher,
    private readonly moderator: Moderator,
  ) {}

  @Post('draft/moderate')
  @ApiOkResponse({ description: 'Save' })
  @ApiNotFoundResponse({ description: 'Draft not found' })
  async moderate(@Body() request: ModerationRequest) {
    const { approved, draftId, moderatorId } = request;

    if (approved) {
      await this.moderator.approve(draftId, moderatorId);
    } else {
      await this.moderator.decline(draftId, moderatorId);
    }
  }

  @Post('draft/create')
  @ApiOkResponse({ description: 'Created' })
  @ApiForbiddenResponse({ description: 'Invalid token' })
  async publishDraft(@Body() request: DraftCreateRequest) {
    await this.publisher.publishDraft(request.token, request);
  }

  @Post('token/create')
  @ApiCreatedResponse({ description: 'Token created', type: PublishToken })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'User can not create drafts' })
  async getToken(
    @Body() { userId }: CreateForUserRequest,
  ): Promise<PublishToken> {
    const token = await this.publisher.getNewToken(userId);

    return token;
  }

  @Get('token/validate/:token')
  @ApiOkResponse({ description: 'Validated', type: Boolean })
  async validateToken(@Param('token') token: string): Promise<boolean> {
    const isValid = await this.publisher.publishTokenIsValid(token);

    return isValid;
  }
}
