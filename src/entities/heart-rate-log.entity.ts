import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 심박수 로그 테이블
 * - IoT 기기에서 전송되는 실시간 데이터
 */
@Entity('heart_rate_log')
export class HeartRateLog {
  /**
   * 심박 로그 PK
   */
  @PrimaryGeneratedColumn()
  hr_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 심박수 (BPM)
   */
  @Column({ type: 'int' })
  bpm: number;

  /**
   * 상태
   * NORMAL / WARNING
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  status: string;

  /**
   * 측정 시각
   */
  @Column({ type: 'timestamp' })
  measured_at: Date;
}
