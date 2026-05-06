import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
import { SessionExerciseDto } from './dto/session-exercise.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,

    @InjectRepository(ExerciseRecord)
    private readonly recordRepository: Repository<ExerciseRecord>,
  ) {}

  /**
   * 특정 세션 리포트 생성
   * - 총 운동 시간
   * - 운동별 수행 시간
   */
  async generateSessionReport(
    userId: string,
    sessionId: number,
  ): Promise<SessionReportResponseDto> {
    /**
     * 1. 세션 존재 여부 확인
     */
    const session = await this.sessionRepository.findOne({
      where: {
        session_id: sessionId,
        user_id: userId,
        status: In(['COMPLETED', 'ABORTED']),
      },
    });

    if (!session) {
      throw new BadRequestException('해당 세션이 존재하지 않습니다.');
    }

    /**
     * 2. 해당 세션의 운동 기록 조회
     */
    const records = await this.recordRepository.find({
      where: { session_id: sessionId },
    });

    /**
     * 3. 총 운동 시간 계산
     */
    const totalDuration = records.reduce(
      (sum, record) => sum + (record.duration ?? 0),
      0,
    );

    /**
     * 4. 세션 심박수 집계 (세션 안에 있는 record의 평균/최고 심박수로 계산)
     */
    const validRecords = records.filter(
      (
        record,
      ): record is ExerciseRecord & {
        avg_heart_rate: number;
        max_heart_rate: number;
      } => record.avg_heart_rate !== null && record.max_heart_rate !== null,
    );

    const sessionAvgHeartRate = validRecords.length
      ? Math.round(
          validRecords.reduce((sum, r) => sum + r.avg_heart_rate, 0) /
            validRecords.length,
        )
      : null;

    const sessionMaxHeartRate = validRecords.length
      ? Math.max(...validRecords.map((r) => r.max_heart_rate))
      : null;

    /**
     * 5. 운동별 정리
     */
    const exerciseSummary: SessionExerciseDto[] = records.map((record) => ({
      exercise_name: record.exercise_name,
      duration: record.duration ?? null,
      avg_heart_rate: record.avg_heart_rate ?? null,
      max_heart_rate: record.max_heart_rate ?? null,
    }));

    /**
     * 5. 반환
     */
    return {
      total_duration: totalDuration,
      avg_heart_rate: sessionAvgHeartRate,
      max_heart_rate: sessionMaxHeartRate,
      status: session.status,
      exercises: exerciseSummary,
    };
  }
}
