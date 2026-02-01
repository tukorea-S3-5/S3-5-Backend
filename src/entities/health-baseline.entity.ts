import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 기초 건강 정보 테이블
 * - 운동 전 사용자 기본 건강 상태 저장
 */
@Entity('health_baseline')
export class HealthBaseline {
  /**
   * 기초 건강 정보 PK
   */
  @PrimaryGeneratedColumn()
  baseline_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 안정 시 심박수
   */
  @Column({ type: 'int', nullable: true })
  resting_hr: number;

  /**
   * 위험 여부 플래그
   * true: 고위험
   */
  @Column({ type: 'boolean', nullable: true })
  risk_flag: boolean;

  /**
   * 기타 메모
   */
  @Column({ type: 'text', nullable: true })
  notes: string;
}
