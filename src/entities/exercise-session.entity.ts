import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 운동 세션 테이블
 * - 한 번의 운동 시작~종료 단위
 */
@Entity('exercise_session')
export class ExerciseSession {
  /**
   * 운동 세션 PK
   */
  @PrimaryGeneratedColumn()
  session_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 운동 시작 시각
   */
  @Column({ type: 'timestamp' })
  started_at: Date;

  /**
   * 운동 종료 시각
   */
  @Column({ type: 'timestamp', nullable: true })
  ended_at: Date;

  /**
   * 평균 심박수
   */
  @Column({ type: 'int', nullable: true })
  avg_hr: number;

  /**
   * 최대 심박수
   */
  @Column({ type: 'int', nullable: true })
  max_hr: number;

  /**
   * 세션 상태
   * COMPLETED / STOPPED
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  status: string;
}
