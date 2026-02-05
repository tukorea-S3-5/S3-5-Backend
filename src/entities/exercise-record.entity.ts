import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseSession } from './exercise-session.entity';

/**
 * 운동 상세 기록
 * - 세션 내 개별 운동
 */
@Entity('exercise_record')
export class ExerciseRecord {
  /**
   * 기록 ID (PK)
   */
  @PrimaryGeneratedColumn()
  record_id: number;

  /**
   * 세션 ID (FK)
   */
  @Column()
  session_id: number;

  /**
   * 세션 관계
   */
  @ManyToOne(
    () => ExerciseSession,
    (session) => session.records,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'session_id' })
  session: ExerciseSession;

  /**
   * 운동 이름
   * 예: 걷기, 요가, 스트레칭
   */
  @Column({ type: 'varchar', length: 100 })
  exercise_name: string;

  /**
   * 운동 시간 (분)
   */
  @Column({ type: 'int' })
  duration: number;

  /**
   * 운동 강도
   * LOW / MEDIUM
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  intensity: string | null;
}