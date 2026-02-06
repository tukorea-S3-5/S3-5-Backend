import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';

@ApiTags('Pregnancy')
@ApiBearerAuth('access-token') // Swagger 보안 스키마 이름과 정확히 맞춤
@UseGuards(AuthGuard('jwt'))
@Controller('pregnancy')
export class PregnancyController {
  constructor(
    private readonly pregnancyService: PregnancyService,
  ) {}

  /**
   * 임신 정보 등록
   * - user_id는 Body로 받지 않음
   * - JWT에서 인증된 사용자 정보(req.user) 기준으로 처리
   */
  @Post()
  @ApiOperation({ summary: '임신 정보 등록 (JWT 기준)' })
  create(
    @Req() req,
    @Body() dto: CreatePregnancyDto,
  ) {
    // JwtStrategy.validate()에서 반환한 user 객체
    // 여기서 user_id를 꺼내 서비스로 전달
    return this.pregnancyService.create(
      req.user.user_id,
      dto,
    );
  }

  /**
   * 내 최신 임신 정보 조회
   */
  @Get('me')
  @ApiOperation({ summary: '내 최신 임신 정보 조회' })
  findMyLatest(@Req() req) {
    return this.pregnancyService.findLatestByUser(
      req.user.user_id,
    );
  }

  /**
   * 내 최신 임신 정보 수정
   */
  @Put('me')
  @ApiOperation({ summary: '내 최신 임신 정보 수정' })
  updateMyLatest(
    @Req() req,
    @Body() dto: UpdatePregnancyDto,
  ) {
    return this.pregnancyService.updateLatestByUser(
      req.user.user_id,
      dto,
    );
  }
}