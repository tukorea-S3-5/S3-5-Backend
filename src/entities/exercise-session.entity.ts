import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExerciseRecord } from './exercise-record.entity';

/**
 * 운동 세션 엔티티
 * - 한 번의 운동 시작 ~ 종료 단위
 */
@Entity('exercise_session')
export class ExerciseSession {
  /**
   * 운동 세션 PK
   */
  @PrimaryGeneratedColumn()
  session_id: number;

  /**
   * 사용자 ID
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 운동 종류
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  exercise_type: string | null;

  /**
   * 운동 시작 시각
   */
  @Column({ type: 'timestamp' })
  started_at: Date;

  /**
   * 운동 종료 시각
   */
  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date | null;

  /**
   * 운동 상태
   * ONGOING / COMPLETED
   */
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /**
   * 세션에 포함된 개별 운동 기록들
   * ExerciseRecord.session 과 연결됨
   */
  @OneToMany(
    () => ExerciseRecord,
    (record) => record.session,
  )
  records: ExerciseRecord[];

  /**
   * 생성 시각
   */
  @CreateDateColumn()
  created_at: Date;
}