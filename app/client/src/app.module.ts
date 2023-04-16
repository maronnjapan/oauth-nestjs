import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizeModule } from './authorize/authorize.module';
import { CallbackModule } from './callback/callback.module';
import { FetchResourceModule } from './fetch-resource/fetch-resource.module';

@Module({
  imports: [AuthorizeModule, CallbackModule, FetchResourceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
