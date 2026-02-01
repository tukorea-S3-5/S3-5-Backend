import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 운동 추천 테이블
 * - 규칙 기반 또는 LLM 기반 추천 결과
 */
@Entity('recommendation')
export class Recommendation {
  /**
   * 추천 PK
   */
  @PrimaryGeneratedColumn()
  rec_id: number;

  /**
   * 사용자 ID (FK)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 추천 생성 주체
   * RULE_ENGINE / LLM
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  source: string;

  /**
   * 추천 내용
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * 생성 시각
   */
  @Column({ type: 'timestamp' })
  created_at: Date;
}
