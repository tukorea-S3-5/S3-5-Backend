import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ExerciseService } from './exercise.service';
import { StartExerciseRecordDto } from './dto/start-exercise-record.dto';
import { EndExerciseRecordDto } from './dto/end-exercise-record.dto';

@ApiTags('Exercise')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('exercise')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
  ) {}

  @Post('session/start')
  @ApiOperation({ summary: '전체 운동 시작' })
  startSession(@Req() req) {
    return this.exerciseService.startSession(req.user.user_id);
  }

  @Post('session/end')
  @ApiOperation({ summary: '전체 운동 종료' })
  endSession(@Req() req) {
    return this.exerciseService.endSession(req.user.user_id);
  }

  @Post('record/start')
  @ApiOperation({ summary: '개별 운동 시작' })
  startRecord(@Req() req, @Body() dto: StartExerciseRecordDto) {
    return this.exerciseService.startRecord(
      req.user.user_id,
      dto.exercise_name,
      dto.order_index,
    );
  }

  @Post('record/end')
  @ApiOperation({ summary: '개별 운동 종료' })
  endRecord(@Body() dto: EndExerciseRecordDto) {
    return this.exerciseService.endRecord(dto.record_id);
  }

  @Get('history')
  @ApiOperation({ summary: '운동 기록 조회' })
  getHistory(@Req() req) {
    return this.exerciseService.getHistory(req.user.user_id);
  }

  @Get()
  @ApiOperation({ summary: '운동 목록 조회' })
  getAllExercises() {
    return this.exerciseService.getAllExercises();
  }

  @Get(':id')
  @ApiOperation({ summary: '운동 상세 조회' })
  getExerciseDetail(@Param('id') id: string) {
    return this.exerciseService.getExerciseDetail(Number(id));
  }
}