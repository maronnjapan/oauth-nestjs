import { Test, TestingModule } from '@nestjs/testing';
import { FetchResourceService } from './fetch-resource.service';

describe('FetchResourceService', () => {
  let service: FetchResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchResourceService],
    }).compile();

    service = module.get<FetchResourceService>(FetchResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
