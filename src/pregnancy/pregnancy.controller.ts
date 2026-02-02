import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';

/**
 * 임신 정보 API 컨트롤러
 */
@ApiTags('Pregnancy')
@Controller('pregnancy')
export class PregnancyController {
  constructor(private readonly pregnancyService: PregnancyService) {}

  /**
   * 임신 정보 등록
   */
  @ApiOperation({ summary: '임신 정보 등록' })
  @ApiBody({ type: CreatePregnancyDto })
  @Post()
  create(@Body() dto: CreatePregnancyDto) {
    return this.pregnancyService.create(dto);
  }

  /**
   * 특정 사용자의 임신 정보 조회
   */
  @ApiOperation({ summary: '사용자 최신 임신 정보 조회' })
  @ApiParam({ name: 'userId', description: '사용자 UUID' })
  @Get(':userId')
  async getLatestPregnancy(@Param('userId') userId: string) {
    return this.pregnancyService.findLatestByUser(userId);
  }

  /**
   * 특정 사용자의 최신 임신 정보 수정
   */
  @ApiOperation({ summary: '사용자 최신 임신 정보 수정' })
  @ApiParam({ name: 'userId', description: '사용자 UUID' })
  @ApiBody({ type: UpdatePregnancyDto })
  @Put(':userId')
  updateLatest(
    @Param('userId')
    userId: string,
    @Body() dto: UpdatePregnancyDto,
  ) {
    return this.pregnancyService.updateLatestByUser(userId, dto);
  }
}
