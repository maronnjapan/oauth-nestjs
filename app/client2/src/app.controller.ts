import { Controller, Get, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  async index(@Req() req: Request) {

    return { access_token: req.session.access_token, refresh_token: req.session.refresh_token, user_info: JSON.stringify(req.session.user_info) };
  }
}
