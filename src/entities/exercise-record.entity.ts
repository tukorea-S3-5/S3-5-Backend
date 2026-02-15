import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseSession } from './exercise-session.entity';

/**
 * 운동 기록 테이블
 * - 세션 기반 운동
 * - 개별 운동
 * - 순차 진행 구조 지원
 */
@Entity('exercise_record')
export class ExerciseRecord {

  /**
   * 운동 기록 PK
   */
  @PrimaryGeneratedColumn()
  record_id: number;

  /**
   * 세션 ID
   * - 전체 운동일 때만 존재
   * - 개별 운동은 null
   */
  @Column({ type: 'int', nullable: true })
  session_id: number | null;

  /**
   * 세션 관계
   */
  @ManyToOne(
    () => ExerciseSession,
    (session) => session.records,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'session_id' })
  session: ExerciseSession | null;

  /**
   * 사용자 UUID
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 운동 ID
   * - 이름 대신 ID 저장하는 것이 안정적
   */
  @Column({ type: 'int' })
  exercise_id: number;

  /**
   * 운동 이름 (리포트용)
   */
  @Column({ type: 'varchar', length: 100 })
  exercise_name: string;

  /**
   * 세션 내 순서
   */
  @Column({ type: 'int' })
  order_index: number;

  /**
   * 시작 시각
   * - 순서가 도래했을 때만 채워짐
   */
  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  /**
   * 종료 시각
   */
  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date | null;

  /**
   * 운동 시간 (초)
   */
  @Column({ type: 'int', nullable: true })
  duration: number | null;
}