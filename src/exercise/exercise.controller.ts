import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ExerciseService } from './exercise.service';

@ApiTags('Exercise')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('exercise')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
  ) { }

  /**
   * 전체 운동 시작
   */
  @Post('session/start')
  @ApiOperation({ summary: '전체 운동 시작' })
  startSession(@Req() req) {
    return this.exerciseService.startRecommendedSession(
      req.user.user_id,
    );
  }

  /**
   * 개별 운동 시작 (여러 개 선택 가능)
   */
  @Post('record/start')
  @ApiOperation({ summary: '개별 운동 시작 (여러 개 선택)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        exercise_ids: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  startSelectedRecords(
    @Req() req,
    @Body() body: { exercise_ids: number[] },
  ) {
    return this.exerciseService.startSelectedRecords(
      req.user.user_id,
      body.exercise_ids,
    );
  }

  /**
   * 운동 종료 (하나씩)
   */
  @Post('record/end')
  @ApiOperation({ summary: '운동 종료 (하나씩)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        record_id: { type: 'number' },
      },
    },
  })
  endRecord(@Body() body: { record_id: number }) {
    return this.exerciseService.endRecord(body.record_id);
  }

  /**
   * 운동 일시정지
   */
  @Post('record/pause')
  @ApiOperation({ summary: '운동 일시정지' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        record_id: { type: 'number' },
      },
    },
  })
  pauseRecord(@Body() body: { record_id: number }) {
    return this.exerciseService.pauseRecord(body.record_id);
  }

  /**
 * 운동 재개
 */
  @Post('record/resume')
  @ApiOperation({ summary: '운동 재개' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        record_id: { type: 'number' },
      },
    },
  })
  resumeRecord(@Body() body: { record_id: number }) {
    return this.exerciseService.resumeRecord(body.record_id);
  }

  /**
   * 세션 중단 (남은 운동 모두 종료 처리)
   */
  @Post('session/abort')
  @ApiOperation({ summary: '운동 세션 중단' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        session_id: { type: 'number' },
      },
    },
  })
  abortSession(@Body() body: { session_id: number }) {
    return this.exerciseService.abortSession(body.session_id);
  }

  /**
   * 운동 기록 조회
   */
  @Get('history')
  @ApiOperation({ summary: '운동 기록 조회' })
  getHistory(@Req() req) {
    return this.exerciseService.getHistory(req.user.user_id);
  }

  /**
 * 현재 진행 중 세션 조회
 */
  @Get('session/current')
  @ApiOperation({ summary: '현재 진행 중 세션 조회' })
  getCurrentSession(@Req() req) {
    return this.exerciseService.getCurrentSession(
      req.user.user_id,
    );
  }
}