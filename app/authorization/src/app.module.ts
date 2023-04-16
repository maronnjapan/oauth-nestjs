import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizeModule } from './authorize/authorize.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [AuthorizeModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
