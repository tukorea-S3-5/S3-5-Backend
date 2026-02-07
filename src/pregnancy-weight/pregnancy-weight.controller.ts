import {
  Controller,
  Get,
  Post,
  Put,
  Param,
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

import { PregnancyWeightService } from './pregnancy-weight.service';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';
import { UpdateWeightLogDto } from './dto/update-weight-log.dto';

@ApiTags('Pregnancy Weight')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('pregnancy/weight')
export class PregnancyWeightController {
  constructor(
    private readonly pregnancyWeightService: PregnancyWeightService,
  ) {}

  /**
   * 임신 주차별 체중 기록 등록
   */
  @Post()
  @ApiOperation({ summary: '임신 주차별 체중 기록 등록' })
  addWeight(
    @Req() req,
    @Body() dto: CreateWeightLogDto,
  ) {
    return this.pregnancyWeightService.addWeight(
      req.user.user_id,
      dto,
    );
  }
  
  /**
   * 임신 주차별 체중 기록 조회 + 체중 증가 요약
   */
  @Get()
  @ApiOperation({
    summary: '임신 주차별 체중 기록 + 체중 증가 요약 조회',
  })
  getMyWeightLogs(@Req() req) {
    return this.pregnancyWeightService.getMyWeightLogs(
      req.user.user_id,
    );
  }

  /**
   * 임신 주차별 체중 기록 수정
   */
  @Put(':week')
  @ApiOperation({ summary: '임신 주차별 체중 기록 수정' })
  updateWeight(
    @Req() req,
    @Param('week') week: string,
    @Body() dto: UpdateWeightLogDto,
  ) {
    return this.pregnancyWeightService.updateWeight(
      req.user.user_id,
      Number(week),
      dto,
    );
  }
}