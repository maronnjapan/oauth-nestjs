import { Test, TestingModule } from '@nestjs/testing';
import { IntrospectController } from './introspect.controller';

describe('IntrospectController', () => {
  let controller: IntrospectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntrospectController],
    }).compile();

    controller = module.get<IntrospectController>(IntrospectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
