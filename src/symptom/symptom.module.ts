import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymptomLog } from '../entities/symptom-log.entity';
import { SymptomService } from './symptom.service';
import { SymptomController } from './symptom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SymptomLog])],
  providers: [SymptomService],
  controllers: [SymptomController],
})
export class SymptomModule {}