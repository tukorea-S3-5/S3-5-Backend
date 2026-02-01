import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 증상 기록 테이블
 * - 사용자가 직접 체크한 증상 로그
 */
@Entity('symptom_log')
export class SymptomLog {
  /**
   * 증상 기록 PK
   */
  @PrimaryGeneratedColumn()
  symptom_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 증상 종류
   */
  @Column({ type: 'varchar', length: 50 })
  symptom_type: string;

  /**
   * 증상 강도 (1~5 등)
   */
  @Column({ type: 'int', nullable: true })
  severity: number;

  /**
   * 기록 시각
   */
  @Column({ type: 'timestamp' })
  logged_at: Date;
}
