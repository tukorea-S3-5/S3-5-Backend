import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseStep } from '../entities/exercise-step.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,

    @InjectRepository(ExerciseRecord)
    private readonly recordRepository: Repository<ExerciseRecord>,

    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,

    @InjectRepository(ExerciseStep)
    private readonly stepRepository: Repository<ExerciseStep>,
  ) {}

  /**
   * 전체 운동 시작
   */
  async startSession(userId: string) {
    const session = this.sessionRepository.create({
      user_id: userId,
      status: 'ONGOING',
      started_at: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  /**
   * 전체 운동 종료
   */
  async endSession(userId: string) {
    const session = await this.sessionRepository.findOne({
      where: { user_id: userId, status: 'ONGOING' },
    });

    if (!session) {
      throw new BadRequestException('진행 중인 전체 운동이 없습니다.');
    }

    session.status = 'COMPLETED';
    session.ended_at = new Date();

    return this.sessionRepository.save(session);
  }

  /**
   * 개별 운동 시작
   */
  async startRecord(
    userId: string,
    exerciseName: string,
    orderIndex: number,
  ) {
    const record = this.recordRepository.create({
      user_id: userId,
      exercise_name: exerciseName,
      order_index: orderIndex,
      started_at: new Date(),
      session_id: null,
    });

    return this.recordRepository.save(record);
  }

  /**
   * 개별 운동 종료
   */
  async endRecord(recordId: number) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record || record.ended_at) {
      throw new BadRequestException('종료할 운동 기록이 없습니다.');
    }

    record.ended_at = new Date();
    record.duration = Math.floor(
      (record.ended_at.getTime() - record.started_at.getTime()) / 1000,
    );

    return this.recordRepository.save(record);
  }

  /**
   * 운동 기록 전체 조회
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
        ended_at: Not(IsNull()),
      },
      order: { started_at: 'DESC' },
    });

    return {
      sessions,
      single_records: singleRecords,
    };
  }

  /**
   * 운동 목록 조회
   */
  async getAllExercises() {
    return this.exerciseRepository.find({
      order: { exercise_id: 'ASC' },
    });
  }

  /**
   * 운동 상세 조회
   * - 단계 포함
   * - 단계 순서 정렬
   */
  async getExerciseDetail(exerciseId: number) {
    const exercise = await this.exerciseRepository.findOne({
      where: { exercise_id: exerciseId },
    });

    if (!exercise) {
      throw new BadRequestException('운동이 존재하지 않습니다.');
    }

    const steps = await this.stepRepository.find({
      where: { exercise_id: exerciseId },
      order: { step_order: 'ASC' },
    });

    return {
      ...exercise,
      steps,
    };
  }
}