import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourceModule } from './resource/resource.module';
import { UserinfoModule } from './userinfo/userinfo.module';

@Module({
  imports: [ResourceModule, UserinfoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
