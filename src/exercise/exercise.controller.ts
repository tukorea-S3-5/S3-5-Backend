import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ExerciseService } from './exercise.service';
import { StartExerciseDto } from './dto/start-exercise.dto';

@ApiTags('Exercise')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('exercise')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
  ) {}

  /**
   * 운동 시작
   * - user_id는 JWT(req.user)에서 가져온다
   * - exercise_type은 선택 값
   */
  @Post('start')
  @ApiOperation({ summary: '운동 시작' })
  start(
    @Req() req,
    @Body() dto: StartExerciseDto,
  ) {
    return this.exerciseService.startExercise(
      req.user.user_id,
      dto,
    );
  }

  /**
   * 운동 종료
   * - 진행 중(ONGOING)인 운동 세션을 종료
   */
  @Post('end')
  @ApiOperation({ summary: '운동 종료' })
  end(@Req() req) {
    return this.exerciseService.endExercise(
      req.user.user_id,
    );
  }
}