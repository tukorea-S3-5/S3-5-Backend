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
 * - 전체 운동 시작/종료용
 * - 개별 운동 없이도 존재 가능
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
   */
  @CreateDateColumn()
  started_at: Date;

  /**
   * 세션 종료 시각
   */
  @Column({ type: 'datetime', nullable: true })
  ended_at: Date | null;

  /**
   * 세션에 포함된 운동 기록
   * - 없을 수도 있음
   */
  @OneToMany(() => ExerciseRecord, (record) => record.session)
  records: ExerciseRecord[];
}