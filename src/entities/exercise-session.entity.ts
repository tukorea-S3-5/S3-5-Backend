import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ExerciseRecord } from './exercise-record.entity';

/**
 * 전체 운동 세션
 * - 추천 기반 전체 운동 묶음
 */
@Entity('exercise_session')
export class ExerciseSession {
  @PrimaryGeneratedColumn()
  session_id: number;

  /**
   * 사용자 UUID
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 세션 상태
   * ONGOING / COMPLETED
   */
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /**
   * 세션 시작 시각
   * - 세션 생성 시 자동 기록
   */
  @CreateDateColumn({ type: 'timestamp' })
  started_at: Date;

  /**
   * 세션 종료 시각
   */
  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date | null;

  /**
   * 세션에 포함된 운동 기록
   */
  @OneToMany(
    () => ExerciseRecord,
    (record) => record.session,
  )
  records: ExerciseRecord[];
}