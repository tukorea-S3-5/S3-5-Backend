import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { PregnancyWeightService } from './pregnancy-weight.service';
import { PregnancyWeightController } from './pregnancy-weight.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PregnancyInfo,
      PregnancyWeightLog,
    ]),
  ],
  controllers: [
    PregnancyWeightController,
  ],
  providers: [
    PregnancyWeightService,
  ],
})
export class PregnancyWeightModule {}