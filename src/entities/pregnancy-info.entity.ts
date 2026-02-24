import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { PregnancyCondition } from './pregnancy-condition.entity';

/**
 * PregnancyInfo
 *
 * 임신 기준 정보 저장 테이블
 *
 * 설계 원칙:
 * - 주차(week)와 분기(trimester)는 저장하지 않는다.
 * - last_menstrual_period(LMP)만 저장하고
 *   조회 시마다 동적으로 계산한다.
 */
@Entity('pregnancy_info')
export class PregnancyInfo {

  @PrimaryGeneratedColumn()
  pregnancy_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

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
   * 현재는 LMP와 동일
   */
  @Column({ type: 'date' })
  pregnancy_start_date: Date;

  /**
   * 출산 예정일
   */
  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'boolean', nullable: true })
  is_multiple: boolean | null;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  pre_weight: number;

  @Column({ type: 'float', nullable: true })
  bmi: number;

  /**
   * 임신 전 운동 수준
   */
  @Column({ type: 'varchar', length: 20 })
  fitness_level: 'ACTIVE' | 'SEDENTARY';

  /**
   * 최대 허용 심박수
   * (현재는 저장형 유지)
   */
  @Column({ type: 'int' })
  max_allowed_bpm: number;

  @OneToMany(
    () => PregnancyCondition,
    condition => condition.pregnancy,
  )
  conditions: PregnancyCondition[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}