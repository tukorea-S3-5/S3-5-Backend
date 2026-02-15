import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RecommendService } from './recommend.service';

@ApiTags('Recommend')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('recommend')
export class RecommendController {
  constructor(
    private readonly recommendService: RecommendService,
  ) {}

  /**
   * 운동 추천 API
   * - 사용자 증상은 DB에서 조회
   * - body 없음
   */
  @Get()
  @ApiOperation({ summary: '운동 추천 (저장된 최신 증상 기반)' })
  async recommend(@Req() req) {
    return this.recommendService.recommend(
      req.user.user_id,
    );
  }
}