import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';

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
  async generateSessionReport(userId: string, sessionId: number) {
    /**
     * 1. 세션 존재 여부 확인
     */
    const session = await this.sessionRepository.findOne({
      where: {
        session_id: sessionId,
        user_id: userId,
        status: 'COMPLETED',
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
     * 4. 운동별 정리
     */
    const exerciseSummary = records.map((record) => ({
      exercise_name: record.exercise_name,
      duration: record.duration,
      avg_heart_rate: null, // IoT 연동 전
      max_heart_rate: null, // IoT 연동 전
    }));

    /**
     * 5. 반환
     */
    return {
      total_duration: totalDuration,
      avg_heart_rate: null,
      max_heart_rate: null,
      exercises: exerciseSummary,
    };
  }
}
