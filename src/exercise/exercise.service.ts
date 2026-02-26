import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';

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
  ) { }

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
        total_duration: 0,
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
   * 개별 운동 시작 (선택 시작)
   * - 선택한 운동들만 세션 생성
   * - 첫 번째 운동만 started_at 세팅
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
   * - 마지막이면 세션 total_duration 계산
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

    const additional = Math.floor(
      (record.ended_at.getTime() -
        record.started_at.getTime()) / 1000,
    );

    record.duration = (record.duration ?? 0) + additional;

    await this.recordRepository.save(record);

    /**
     * 다음 운동 찾기
     */
    const nextRecord = await this.recordRepository.findOne({
      where: {
        user_id: record.user_id,
        session_id:
          record.session_id === null
            ? IsNull()
            : record.session_id,
        order_index: record.order_index + 1,
        started_at: IsNull(),
      },
    });

    if (nextRecord) {
      nextRecord.started_at = new Date();
      await this.recordRepository.save(nextRecord);
    } else {
      /**
       * 세션 종료 처리
       */
      const session = await this.sessionRepository.findOne({
        where: {
          session_id:
            record.session_id === null
              ? undefined
              : record.session_id,
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
  async resumeRecord(recordId: number) {
    const record = await this.recordRepository.findOne({
      where: { record_id: recordId },
    });

    if (!record) {
      throw new BadRequestException('운동 기록이 없습니다.');
    }

    if (record.ended_at) {
      throw new BadRequestException('이미 종료된 운동입니다.');
    }

    if (record.started_at) {
      throw new BadRequestException('이미 진행 중입니다.');
    }

    // 세션 상태 체크 추가
    if (record.session_id) {
      const session = await this.sessionRepository.findOne({
        where: { session_id: record.session_id },
      });

      if (!session || session.status !== 'ONGOING') {
        throw new BadRequestException('이미 종료된 세션입니다.');
      }
    }

    record.started_at = new Date();

    await this.recordRepository.save(record);

    return record;
  }

  /**
   * 세션 중단
   * - 현재 운동 종료
   * - 남은 운동 전부 종료 처리
   * - 세션 상태 ABORTED
   */
  async abortSession(sessionId: number) {
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
        record.ended_at = now;
        record.duration = Math.floor(
          (now.getTime() - record.started_at.getTime()) / 1000,
        );
      }

      if (!record.duration) {
        record.duration = 0;
      }

      totalDuration += record.duration;

      await this.recordRepository.save(record);
    }

    session.status = 'ABORTED';
    session.ended_at = now;
    session.total_duration = totalDuration;

    await this.sessionRepository.save(session);

    return session;
  }

  /**
  * 현재 진행 중 세션 조회
  */
  async getCurrentSession(userId: string) {
    const session = await this.sessionRepository.findOne({
      where: {
        user_id: userId,
        status: 'ONGOING',
      },
      relations: ['records'],
      order: { started_at: 'DESC' },
    });

    if (!session) {
      return {
        message: '현재 진행 중인 운동이 없습니다.',
      };
    }

    return {
      ...session,
      total_duration_formatted: this.formatDuration(
        session.total_duration ?? 0,
      ),
    };
  }

  /**
   * 운동 기록 조회
   * - 세션 총 시간 포맷 포함
   */
  async getHistory(userId: string) {
    const sessions = await this.sessionRepository.find({
      where: {
        user_id: userId,
        status: In(['COMPLETED', 'ABORTED']),
      },
      relations: ['records'],
      order: { started_at: 'DESC' },
    });

    return {
      sessions: sessions.map((s) => ({
        ...s,
        total_duration_formatted: this.formatDuration(
          s.total_duration ?? 0,
        ),
      })),
    };
  }

  /**
  * 초 → 시간 포맷 변환
  */
  private formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts: string[] = [];

    if (h > 0) {
      parts.push(`${h}시간`);
    }

    if (m > 0) {
      parts.push(`${m}분`);
    }

    if (s > 0 || parts.length === 0) {
      parts.push(`${s}초`);
    }

    return parts.join(' ');
  }
}