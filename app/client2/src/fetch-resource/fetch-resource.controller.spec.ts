import { Test, TestingModule } from '@nestjs/testing';
import { FetchResourceController } from './fetch-resource.controller';

describe('FetchResourceController', () => {
  let controller: FetchResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchResourceController],
    }).compile();

    controller = module.get<FetchResourceController>(FetchResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
