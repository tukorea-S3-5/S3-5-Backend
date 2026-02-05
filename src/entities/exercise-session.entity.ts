import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ExerciseRecord } from './exercise-record.entity';

/**
 * 운동 세션
 * - 한 번의 운동 단위
 */
@Entity('exercise_session')
export class ExerciseSession {
  /**
   * 세션 ID (PK)
   */
  @PrimaryGeneratedColumn()
  session_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 사용자 관계
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
   * 평균 심박수
   */
  @Column({ type: 'int', nullable: true })
  avg_hr: number | null;

  /**
   * 최대 심박수
   */
  @Column({ type: 'int', nullable: true })
  max_hr: number | null;

  /**
   * 상태
   * - ONGOING / COMPLETED / STOPPED
   */
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /**
   * 운동 상세 기록들
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

  /**
   * 수정 시각
   */
  @UpdateDateColumn()
  updated_at: Date;
}