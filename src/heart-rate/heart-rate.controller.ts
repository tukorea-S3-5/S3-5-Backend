import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
  } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  
  import { HeartRateService } from './heart-rate.service';
  import { UpdateRestingHrDto } from './dto/update-resting-hr.dto';
  import { CheckHeartRateDto } from './dto/check-heart-rate.dto';
  
  @ApiTags('HeartRate')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Controller('heart-rate')
  export class HeartRateController {
    constructor(
      private readonly heartRateService: HeartRateService,
    ) {}
  
    /**
     * 안정 심박 저장
     */
    @Post('resting')
    @ApiOperation({ summary: '안정 심박 저장' })
    async updateResting(
      @Req() req,
      @Body() dto: UpdateRestingHrDto,
    ) {
      return this.heartRateService.updateRestingHeartRate(
        req.user.user_id,
        dto.restingHeartRate,
      );
    }
  
    /**
     * 심박 위험 판단
     */
    @Post('check')
    @ApiOperation({ summary: '심박 위험 판단' })
    async check(
      @Req() req,
      @Body() dto: CheckHeartRateDto,
    ) {
      return this.heartRateService.checkHeartRate(
        req.user.user_id,
        dto.currentHeartRate,
      );
    }
  }