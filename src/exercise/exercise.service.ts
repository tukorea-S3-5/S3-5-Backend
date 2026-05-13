import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { RecommendService } from '../recommend/recommend.service';

type SessionStartType = 'recommend' | 'caution';

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
  async startRecommendedSession(
    userId: string,
    type: SessionStartType = 'recommend',
  ) {
    const existingSession = await this.sessionRepository.findOne({
      where: { user_id: userId, status: 'ONGOING' },
    });

    if (existingSession) {
      throw new BadRequestException('이미 진행 중인 세션이 있습니다.');
    }

    const result = await this.recommendService.recommend(userId);

    const availableExercises =
      type === 'caution' ? result.caution : result.recommend;

    if (!availableExercises.length) {
      throw new BadRequestException(
        type === 'caution'
          ? '수행 가능한 주의 운동이 없습니다.'
          : '수행 가능한 추천 운동이 없습니다.',
      );
    }

    const session = await this.sessionRepository.save(
      this.sessionRepository.create({
        user_id: userId,
        status: 'ONGOING',
        total_duration: 0,
      }),
    );

    const createdRecords: ExerciseRecord[] = [];

    for (let i = 0; i < availableExercises.length; i++) {
      const record = await this.recordRepository.save(
        this.recordRepository.create({
          user_id: userId,
          session_id: session.session_id,
          exercise_id: availableExercises[i].exercise_id,
          exercise_name: availableExercises[i].exercise_name,
          order_index: i + 1,
          started_at: null,
        }),
      );

      createdRecords.push(record);
    }

    return { session, records: createdRecords };
  }

  /**
   * 개별 운동 시작 (선택 시작)
   */
  async startSelectedRecords(userId: string, exerciseIds: number[]) {
    const existingSession = await this.sessionRepository.findOne({
      where: { user_id: userId, status: 'ONGOING' },
    });

    if (existingSession) {
      throw new BadRequestException('이미 진행 중인 세션이 있습니다.');
    }

    const result = await this.recommendService.recommend(userId);
    const allowedPool = [...result.recommend, ...result.caution];

    const allowedExercises = allowedPool.filter((ex) =>
      exerciseIds.includes(ex.exercise_id),
    );

    if (!allowedExercises.length) {
      throw new BadRequestException(
        '선택한 운동이 수행 가능한 목록에 없습니다.',
      );
    }

    const session = await this.sessionRepository.save(
      this.sessionRepository.create({
        user_id: userId,
        status: 'ONGOING',
        total_duration: 0,
      }),
    );

    const createdRecords: ExerciseRecord[] = [];

    for (let i = 0; i < allowedExercises.length; i++) {
      const record = await this.recordRepository.save(
        this.recordRepository.create({
          user_id: userId,
          session_id: session.session_id,
          exercise_id: allowedExercises[i].exercise_id,
          exercise_name: allowedExercises[i].exercise_name,
          order_index: i + 1,
          started_at: null,
        }),
      );

      createdRecords.push(record);
    }

    return { session, records: createdRecords };
  }

  /**
   * 운동 종료
   */
  async endRecord(recordId: number, heartRates?: number[]) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record) {
      throw new BadRequestException('운동 기록이 없습니다.');
    }

    if (!record.started_at && (record.duration ?? 0) <= 0) {
      throw new BadRequestException('아직 시작되지 않은 운동입니다.');
    }

    if (record.ended_at) {
      throw new BadRequestException('이미 종료된 운동입니다.');
    }

    const endedAt = new Date();

    if (record.started_at) {
      const additional = Math.floor(
        (endedAt.getTime() - record.started_at.getTime()) / 1000,
      );
      record.duration = (record.duration ?? 0) + additional;
    }

    record.ended_at = endedAt;
    record.started_at = null;

    const heartRateSummary = this.calculateHeartRateSummary(heartRates);

    if (heartRateSummary) {
      record.avg_heart_rate = heartRateSummary.avgHeartRate;
      record.max_heart_rate = heartRateSummary.maxHeartRate;
    }

    await this.recordRepository.save(record);

    const remainingRecordCount = await this.recordRepository.count({
      where: {
        session_id: record.session_id === null ? IsNull() : record.session_id,
        ended_at: IsNull(),
      },
    });

    if (remainingRecordCount === 0) {
      const session = await this.sessionRepository.findOne({
        where: {
          session_id:
            record.session_id === null ? undefined : record.session_id,
        },
        relations: ['records'],
      });

      if (session) {
        const totalDuration = session.records.reduce(
          (sum, r) => sum + (r.duration ?? 0),
          0,
        );

        session.status = 'COMPLETED';
        session.ended_at = new Date();
        session.total_duration = totalDuration;

        await this.sessionRepository.save(session);
      }
    }

    return record;
  }

  /**
   * 운동 일시정지
   */
  async pauseRecord(recordId: number) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record) {
      throw new BadRequestException('운동 기록이 없습니다.');
    }

    if (!record.started_at) {
      throw new BadRequestException('진행 중인 운동이 아닙니다.');
    }

    if (record.ended_at) {
      throw new BadRequestException('이미 종료된 운동입니다.');
    }

    const now = new Date();
    const additional = Math.floor(
      (now.getTime() - record.started_at.getTime()) / 1000,
    );

    record.duration = (record.duration ?? 0) + additional;
    record.started_at = null;

    await this.recordRepository.save(record);

    return record;
  }

  /**
   * 운동 재개
   */
  async startOrResumeRecord(recordId: number) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record) {
      throw new BadRequestException('운동 기록이 없습니다.');
    }

    if (record.ended_at) {
      throw new BadRequestException('이미 종료된 운동입니다.');
    }

    record.started_at = new Date();
    await this.recordRepository.save(record);

    return record;
  }

  /**
   * 세션 중단
   */
  async abortSession(sessionId: number, heartRates?: number[]) {
    const session = await this.sessionRepository.findOne({
      where: { session_id: sessionId },
      relations: ['records'],
    });

    if (!session) {
      throw new BadRequestException('세션이 존재하지 않습니다.');
    }

    const now = new Date();
    let totalDuration = 0;

    for (const record of session.records) {
      if (record.started_at && !record.ended_at) {
        const additional = Math.floor(
          (now.getTime() - record.started_at.getTime()) / 1000,
        );
        record.duration = (record.duration ?? 0) + additional;
        record.ended_at = now;
        record.started_at = null;
      }

      totalDuration += record.duration ?? 0;
      await this.recordRepository.save(record);
    }

    session.status = 'ABORTED';
    session.ended_at = now;
    session.total_duration = totalDuration;

    await this.sessionRepository.save(session);

    return session;
  }

  async getCurrentSession(userId: string) {
    const session = await this.sessionRepository.findOne({
      where: { user_id: userId, status: 'ONGOING' },
      relations: ['records'],
    });

    if (!session) {
      return { message: '현재 진행 중인 운동이 없습니다.' };
    }

    return session;
  }

  async getHistory(userId: string) {
    const sessions = await this.sessionRepository.find({
      where: {
        user_id: userId,
        status: In(['COMPLETED', 'ABORTED']),
      },
      relations: ['records'],
    });

    return { sessions };
  }

  private calculateHeartRateSummary(heartRates?: number[]) {
    if (!heartRates?.length) return null;

    const validHeartRates = heartRates.filter(
      (bpm) => Number.isInteger(bpm) && bpm > 50 && bpm < 180,
    );

    if (!validHeartRates.length) return null;

    const sum = validHeartRates.reduce((acc, bpm) => acc + bpm, 0);
    const avgHeartRate = Math.round(sum / validHeartRates.length);
    const maxHeartRate = Math.max(...validHeartRates);

    return { avgHeartRate, maxHeartRate };
  }
}