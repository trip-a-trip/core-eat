import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Param,
  Get,
  NotFoundException,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

import { Collaborator } from '&app/collaboration/domain/collaborator.entity';
import { TransformInterceptor } from '&app/lib/nest';

@Controller('/v1/collaborator')
@UseInterceptors(TransformInterceptor)
@ApiTags('collaborator')
export class CollaboratorController {
  constructor(
    @InjectRepository(Collaborator)
    private readonly repo: Repository<Collaborator>,
  ) {}

  @Get('/profile/:user_id')
  @ApiOkResponse({ description: 'Success', type: Collaborator })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getProfile(@Param('user_id') userId: string): Promise<Collaborator> {
    const profile = await this.repo.findOne(userId);

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return profile;
  }
}
