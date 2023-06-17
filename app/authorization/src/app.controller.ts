import { Controller, Get } from '@nestjs/common';
import prismaService from '~/prisma'
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello() {
    return await prismaService.user.count();
  }
}
