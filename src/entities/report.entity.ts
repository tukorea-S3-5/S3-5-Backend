import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';

/**
 * 리포트 테이블
 * - 운동 리포트 / 주간 요약 / 위험 분석 결과
 */
@Entity('report')
export class Report {
  /**
   * 리포트 PK
   */
  @PrimaryGeneratedColumn()
  report_id: number;

  /**
   * 사용자 ID (FK)
   * - 조회 최적화 및 명시적 관계 표현용
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 운동 세션 ID (FK)
   * - 운동 리포트인 경우에만 값 존재
   * - 주간/위험 리포트는 NULL
   */
  @Column({ type: 'int', nullable: true })
  session_id: number | null;

  /**
   * ExerciseSession과의 관계
   */
  @ManyToOne(() => ExerciseSession, { nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: ExerciseSession | null;

  /**
   * 리포트 유형
   * - SESSION : 운동 1회 요약
   * - WEEKLY  : 주간 요약
   * - RISK    : 위험 분석
   */
  @Column({ type: 'varchar', length: 20 })
  type: 'SESSION' | 'WEEKLY' | 'RISK';

  /**
   * 리포트 요약 내용
   */
  @Column({ type: 'text' })
  summary: string;

  /**
   * 생성 시각
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
