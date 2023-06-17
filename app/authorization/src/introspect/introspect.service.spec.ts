import { Test, TestingModule } from '@nestjs/testing';
import { IntrospectService } from './introspect.service';

describe('IntrospectService', () => {
  let service: IntrospectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrospectService],
    }).compile();

    service = module.get<IntrospectService>(IntrospectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
