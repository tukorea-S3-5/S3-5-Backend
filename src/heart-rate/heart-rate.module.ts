import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartRateService } from './heart-rate.service';
import { HeartRateController } from './heart-rate.controller';
import { User } from '../user/user.entity';
import { HeartRateRecord } from './heart-rate-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, HeartRateRecord])],
  providers: [HeartRateService],
  controllers: [HeartRateController],
})
export class HeartRateModule {}