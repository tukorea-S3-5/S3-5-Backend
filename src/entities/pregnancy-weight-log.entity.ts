import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { PregnancyInfo } from './pregnancy-info.entity';

/**
 * 임신 주차별 체중 기록 테이블
 * - 한 임신당 주차별 체중 기록
 * - 한 주차에는 하나의 체중만 허용
 */
@Entity('pregnancy_weight_log')
@Unique(['pregnancy_id', 'week'])
export class PregnancyWeightLog {
  /**
   * 체중 기록 ID (PK)
   */
  @PrimaryGeneratedColumn()
  weight_log_id: number;

  /**
   * 임신 정보 FK
   */
  @Column()
  pregnancy_id: number;

  /**
   * 임신 주차
   */
  @Column({ type: 'int' })
  week: number;

  /**
   * 해당 주차 체중 (kg)
   */
  @Column({ type: 'float' })
  weight: number;

  /**
   * 임신 정보와의 관계
   */
  @ManyToOne(() => PregnancyInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pregnancy_id' })
  pregnancy: PregnancyInfo;

  /**
   * 기록 생성 시각
   */
  @CreateDateColumn()
  created_at: Date;
}