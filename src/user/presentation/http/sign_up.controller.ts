import { Controller, Post } from '@nestjs/common';

import { Registrator } from '&app/user/application/registrator';

@Controller('/v1/sign-up')
export class SignUpController {
  constructor(private readonly registrator: Registrator) {}

  @Post('/')
  async signUp() {
    const user = await this.registrator.registerUser();

    return user;
  }
}
