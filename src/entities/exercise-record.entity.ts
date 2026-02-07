import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseSession } from './exercise-session.entity';

/**
 * 운동 기록
 * - 개별 운동
 * - 세션에 속할 수도, 안 속할 수도 있음
 */
@Entity('exercise_record')
export class ExerciseRecord {
  @PrimaryGeneratedColumn()
  record_id: number;

  /**
   * 세션 ID
   * - 전체 운동일 때만 존재
   * - 개별 운동은 NULL
   */
  @Column({ nullable: true })
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
   * 운동 이름
   */
  @Column({ type: 'varchar', length: 100 })
  exercise_name: string;

  /**
   * 운동 순서
   */
  @Column({ type: 'int' })
  order_index: number;

  /**
   * 운동 시작 시각
   */
  @Column({ type: 'datetime' })
  started_at: Date;

  /**
   * 운동 종료 시각
   */
  @Column({ type: 'datetime', nullable: true })
  ended_at: Date | null;

  /**
   * 운동 시간 (초)
   */
  @Column({ type: 'int', nullable: true })
  duration: number | null;
}