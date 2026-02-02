import { Test, TestingModule } from '@nestjs/testing';
import { PregnancyService } from './pregnancy.service';

describe('PregnancyService', () => {
  let service: PregnancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PregnancyService],
    }).compile();

    service = module.get<PregnancyService>(PregnancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
