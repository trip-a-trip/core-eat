import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import uid from 'uid';

import { User } from '../domain/user.entity';

@Injectable()
export class Registrator {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async registerUser() {
    const userId = uid();

    const user = new User(userId);

    await this.em.save(user);

    return user;
  }
}
