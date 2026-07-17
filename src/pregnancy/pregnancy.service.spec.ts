import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PregnancyCondition } from '../entities/pregnancy-condition.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { User } from '../user/user.entity';
import { PregnancyService } from './pregnancy.service';

describe('PregnancyService', () => {
  let service: PregnancyService;
  const repositoryMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PregnancyService,
        {
          provide: getRepositoryToken(PregnancyInfo),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(PregnancyWeightLog),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(PregnancyCondition),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<PregnancyService>(PregnancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
