import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyService } from './pregnancy.service';
import { PregnancyController } from './pregnancy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PregnancyInfo])],
  controllers: [PregnancyController],
  providers: [PregnancyService],
})
export class PregnancyModule {}
