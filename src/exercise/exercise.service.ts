import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { RecommendService } from '../recommend/recommend.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,

    @InjectRepository(ExerciseRecord)
    private readonly recordRepository: Repository<ExerciseRecord>,

    private readonly recommendService: RecommendService,
  ) {}

  /**
   * 전체 운동 시작
   * - 첫 번째만 시작
   * - record 목록 반환
   */
  async startRecommendedSession(userId: string) {
    const result = await this.recommendService.recommend(userId);

    if (!result.recommend.length) {
      throw new BadRequestException('추천 운동이 없습니다.');
    }

    const session = await this.sessionRepository.save(
      this.sessionRepository.create({
        user_id: userId,
        status: 'ONGOING',
      }),
    );

    const createdRecords: ExerciseRecord[] = [];

    for (let i = 0; i < result.recommend.length; i++) {
      const record = await this.recordRepository.save(
        this.recordRepository.create({
          user_id: userId,
          session_id: session.session_id,
          exercise_id: result.recommend[i].exercise_id,
          exercise_name: result.recommend[i].exercise_name,
          order_index: i + 1,
          started_at: i === 0 ? new Date() : null,
        }),
      );

      createdRecords.push(record);
    }

    return {
      session,
      records: createdRecords,
    };
  }

  /**
   * 개별 운동 시작 (순차 진행)
   * - 첫 번째만 시작
   * - record 목록 반환
   */
  async startSelectedRecords(
    userId: string,
    exerciseIds: number[],
  ) {
    const result = await this.recommendService.recommend(userId);
  
    const allowedExercises = result.recommend.filter((ex) =>
      exerciseIds.includes(ex.exercise_id),
    );
  
    if (!allowedExercises.length) {
      throw new BadRequestException(
        '선택한 운동이 추천 목록에 없습니다.',
      );
    }
  
    // 개별 운동도 세션 생성
    const session = await this.sessionRepository.save(
      this.sessionRepository.create({
        user_id: userId,
        status: 'ONGOING',
      }),
    );
  
    const createdRecords: ExerciseRecord[] = [];
  
    for (let i = 0; i < allowedExercises.length; i++) {
      const record = await this.recordRepository.save(
        this.recordRepository.create({
          user_id: userId,
          session_id: session.session_id, // NULL 제거
          exercise_id: allowedExercises[i].exercise_id,
          exercise_name: allowedExercises[i].exercise_name,
          order_index: i + 1,
          started_at: i === 0 ? new Date() : null,
        }),
      );
  
      createdRecords.push(record);
    }
  
    return {
      session,
      records: createdRecords,
    };
  }

  /**
   * 운동 종료
   * - 다음 운동 자동 시작
   */
  async endRecord(recordId: number) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record) {
      throw new BadRequestException('운동 기록이 없습니다.');
    }

    if (!record.started_at) {
      throw new BadRequestException('아직 시작되지 않은 운동입니다.');
    }

    if (record.ended_at) {
      throw new BadRequestException('이미 종료된 운동입니다.');
    }

    record.ended_at = new Date();
    record.duration = Math.floor(
      (record.ended_at.getTime() -
        record.started_at.getTime()) / 1000,
    );

    await this.recordRepository.save(record);

    /**
     * 다음 운동 찾기
     * 세션 기반 / 개별 기반 동일 처리
     */
    const whereCondition: any = {
      user_id: record.user_id,
      order_index: record.order_index + 1,
      started_at: IsNull(),
    };

    if (record.session_id !== null) {
      whereCondition.session_id = record.session_id;
    } else {
      whereCondition.session_id = IsNull();
    }

    const nextRecord = await this.recordRepository.findOne({
      where: whereCondition,
    });

    if (nextRecord) {
      nextRecord.started_at = new Date();
      await this.recordRepository.save(nextRecord);
    } else if (record.session_id !== null) {
      /**
       * 세션 마지막이면 종료
       */
      const session = await this.sessionRepository.findOne({
        where: { session_id: record.session_id },
      });

      if (session) {
        session.status = 'COMPLETED';
        session.ended_at = new Date();
        await this.sessionRepository.save(session);
      }
    }

    return record;
  }

  /**
   * 운동 기록 조회
   */
  async getHistory(userId: string) {
    const sessions = await this.sessionRepository.find({
      where: {
        user_id: userId,
        status: 'COMPLETED',
      },
      relations: ['records'],
      order: { started_at: 'DESC' },
    });

    const singleRecords = await this.recordRepository.find({
      where: {
        user_id: userId,
        session_id: IsNull(),
      },
      order: { started_at: 'DESC' },
    });

    return {
      sessions,
      single_records: singleRecords,
    };
  }
}