import { Test, TestingModule } from '@nestjs/testing';
import { PregnancyController } from './pregnancy.controller';
import { PregnancyService } from './pregnancy.service';

describe('PregnancyController', () => {
  let controller: PregnancyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PregnancyController],
      providers: [
        {
          provide: PregnancyService,
          useValue: {
            create: jest.fn(),
            findLatestByUser: jest.fn(),
            updateLatestByUser: jest.fn(),
            getGuideline: jest.fn(),
            getWeeklyHealth: jest.fn(),
            calculateWeightTrend: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PregnancyController>(PregnancyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
