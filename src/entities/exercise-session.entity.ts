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
 * - 세션 단위 시간 관리
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
   * ONGOING   : 진행 중
   * COMPLETED : 정상 종료
   * ABORTED   : 중단 종료
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: 'ONGOING',
  })
  status: 'ONGOING' | 'COMPLETED' | 'ABORTED';

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
   * 세션 총 운동 시간 (초 단위)
   * - COMPLETED / ABORTED 시 계산
   */
  @Column({ type: 'int', default: 0 })
  total_duration: number;

  /**
   * 세션에 포함된 운동 기록
   */
  @OneToMany(
    () => ExerciseRecord,
    (record) => record.session,
  )
  records: ExerciseRecord[];
}