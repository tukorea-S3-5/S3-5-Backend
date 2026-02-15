import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * 증상 세트 기록 테이블
 *
 * - 사용자가 한 번에 선택한 증상들을 JSON 배열로 저장
 * - 추천 로직은 가장 최신 1개 세트만 사용
 */
@Entity('symptom_log')
export class SymptomLog {

  /**
   * 증상 기록 고유 ID (PK)
   */
  @PrimaryGeneratedColumn()
  symptom_id: number;

  /**
   * 사용자 ID (JWT에서 추출)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * 사용자가 선택한 증상 세트
   * 예: ["요통", "피로감"]
   */
  @Column({ type: 'json' })
  symptoms: string[];

  /**
   * 입력 시간
   */
  @CreateDateColumn()
  created_at: Date;
}