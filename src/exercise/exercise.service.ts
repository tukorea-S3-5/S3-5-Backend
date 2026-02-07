import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,

    @InjectRepository(ExerciseRecord)
    private readonly recordRepository: Repository<ExerciseRecord>,
  ) {}

  /**
   * 전체 운동 시작
   * - 하나의 운동 세션 생성
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
   * - 진행 중인 세션을 COMPLETED 상태로 변경
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
   * - 전체 세션 없이 단독으로 수행되는 운동
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
   * - 시작된 개별 운동의 종료 시간 및 duration 계산
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
   * - 완료된 전체 운동 세션
   * - 완료된 개별 운동 기록
   */
  async getHistory(userId: string) {
    // 전체 운동 세션 (완료된 것만)
    const sessions = await this.sessionRepository.find({
      where: {
        user_id: userId,
        status: 'COMPLETED',
      },
      relations: ['records'],
      order: { started_at: 'DESC' },
    });

    // 개별 운동 (세션 없이 수행 + 종료된 것만)
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
}