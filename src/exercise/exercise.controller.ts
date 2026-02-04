import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { StartExerciseDto } from './dto/start-exercise.dto';
import { EndExerciseDto } from './dto/end-exercise.dto';
import { Get, Param } from '@nestjs/common';

@ApiTags('Exercise')
@Controller('exercise')
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService) { }

    /**
     * 운동 시작
     */
    @Post('start')
    @ApiOperation({ summary: '운동 시작' })
    startExercise(@Body() dto: StartExerciseDto) {
        return this.exerciseService.startExercise(dto);
    }

    /** 
     * * 운동 종료 
     */
    @Post('end')
    @ApiOperation({ summary: '운동 종료' })
    endExercise(@Body() dto: EndExerciseDto) {
        return this.exerciseService.endExercise(dto);
    }

    /**
     * *운동 세션 목록 조회
     */
    @Get(':userId')
    @ApiOperation({ summary: '사용자 운동 기록 조회' })
    getUserSessions(@Param('userId') userId: string) {
        return this.exerciseService.getSessionsByUser(userId);
    }

}