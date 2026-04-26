import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartRateService } from './heart-rate.service';
import { HeartRateController } from './heart-rate.controller';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [HeartRateService],
  controllers: [HeartRateController],
})
export class HeartRateModule {}