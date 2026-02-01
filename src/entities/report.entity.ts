import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 리포트 테이블
 * - 주간 요약 / 위험 분석 결과
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
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 리포트 유형
   * WEEKLY / RISK
   */
  @Column({ type: 'varchar', length: 20 })
  type: string;

  /**
   * 요약 내용
   */
  @Column({ type: 'text' })
  summary: string;

  /**
   * 생성 시각
   */
  @Column({ type: 'timestamp' })
  created_at: Date;
}
