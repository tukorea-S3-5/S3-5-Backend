import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyService } from './pregnancy.service';
import { PregnancyController } from './pregnancy.controller';
import { AuthModule } from '../auth/auth.module';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PregnancyInfo, PregnancyWeightLog, User]),
    AuthModule,
  ],
  controllers: [PregnancyController],
  providers: [PregnancyService],
})
export class PregnancyModule {}
