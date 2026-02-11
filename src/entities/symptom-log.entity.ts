import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * 증상 기록 테이블
 * - 사용자가 선택한 증상을 저장
 * - 중복 허용 (같은 증상 여러 번 입력 가능)
 * - 하루에 여러 번 입력 가능
 */
@Entity('symptom_log') // 실제 DB 테이블명 명시
export class SymptomLog {

  /**
   * 증상 기록 고유 ID (PK)
   */
  @PrimaryGeneratedColumn()
  symptom_id: number;

  /**
   * 증상을 입력한 사용자 ID
   * (JWT에서 꺼낸 userId와 매핑됨)
   */
  @Column()
  user_id: string;

  /**
   * 사용자가 선택한 증상 이름
   * 예: 배뭉침, 요통, 피로감 등
   */
  @Column({ length: 100 })
  symptom_name: string;

  /**
   * 증상이 기록된 시간
   * 자동으로 현재 시간 저장됨
   */
  @CreateDateColumn()
  recorded_at: Date;
}