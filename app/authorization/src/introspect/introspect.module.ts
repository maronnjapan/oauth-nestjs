import { Module } from '@nestjs/common';
import { IntrospectController } from './introspect.controller';
import { IntrospectService } from './introspect.service';

@Module({
  controllers: [IntrospectController],
  providers: [IntrospectService]
})
export class IntrospectModule {}
