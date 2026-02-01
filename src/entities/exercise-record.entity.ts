import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 운동 상세 기록 테이블
 * - 한 세션 내 개별 운동 기록
 */
@Entity('exercise_record')
export class ExerciseRecord {
  /**
   * 운동 기록 PK
   */
  @PrimaryGeneratedColumn()
  record_id: number;

  /**
   * 운동 세션 ID (FK)
   */
  @Column({ type: 'int' })
  session_id: number;

  /**
   * 운동 이름
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
  intensity: string;
}
