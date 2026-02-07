import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

/**
 * 임신 정보 테이블
 * - 임신의 기준 상태 정보를 저장
 * - 체중 변화는 별도 테이블에서 관리
 */
@Entity('pregnancy_info')
export class PregnancyInfo {
  @PrimaryGeneratedColumn()
  pregnancy_id: number;

  /**
   * 사용자 FK (UUID)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * User 엔티티와의 관계
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * 마지막 생리 시작일 (LMP)
   * 모든 임신 주차 계산의 기준
   */
  @Column({ type: 'date' })
  last_menstrual_period: Date;

  /**
   * 임신 시작 기준일
   * 현재는 LMP와 동일하게 사용
   */
  @Column({ type: 'date' })
  pregnancy_start_date: Date;

  /**
   * 현재 임신 주차
   */
  @Column({ type: 'int' })
  week: number;

  /**
   * 임신 단계 (1, 2, 3기)
   */
  @Column({ type: 'int' })
  trimester: number;

  /**
   * 분만 예정일
   */
  @Column({ type: 'date', nullable: true })
  due_date: Date;

  /**
   * 다태아 여부
   * null  : 아직 확인되지 않음
   * false : 단태아
   * true  : 다태아
   */
  @Column({ type: 'boolean', nullable: true })
  is_multiple: boolean | null;

  /**
   * 키 (cm)
   */
  @Column({ type: 'float' })
  height: number;

  /**
   * 임신 전 체중 (kg)
   */
  @Column({ type: 'float' })
  pre_weight: number;

  /**
   * BMI (임신 전 기준)
   */
  @Column({ type: 'float', nullable: true })
  bmi: number;

  @UpdateDateColumn()
  updated_at: Date;
}