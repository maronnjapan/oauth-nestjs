import { Module } from '@nestjs/common';
import { FetchResourceController } from './fetch-resource.controller';
import { FetchResourceService } from './fetch-resource.service';

@Module({
  controllers: [FetchResourceController],
  providers: [FetchResourceService]
})
export class FetchResourceModule {}
