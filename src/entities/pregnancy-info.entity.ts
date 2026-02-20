import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

/**
 * PregnancyInfo
 *
 * 임신 기준 정보 저장 테이블
 *
 * 역할:
 * - 사용자의 현재 임신 상태 기준 데이터 저장
 * - 추천 로직에서 trimester 조회에 사용
 * - 체중 변화 등은 별도 테이블에서 관리
 */
@Entity('pregnancy_info')
export class PregnancyInfo {
  /**
   * 임신 정보 PK
   */
  @PrimaryGeneratedColumn()
  pregnancy_id: number;

  /**
   * 사용자 FK (UUID)
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * User 엔티티 관계 매핑
   * user_id 기준으로 연결
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
   * 추천 로직에서 핵심 필터로 사용
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
   * null  : 확인 전
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

  /**
   * 생성 시 자동 저장
   * 최신 임신 정보 조회 시 정렬 기준으로 사용
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * 수정 시 자동 업데이트
   */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * 임신 전 운동 여부
   * ACTIVE: 꾸준히 함 / SEDENTARY: 거의 안 함
   */
  @Column({ type: 'varchar', length: 20 })
  fitness_level: 'ACTIVE' | 'SEDENTARY';

  /**
   * 최대 허용 심박수
   * 나이와 운동 여부를 바탕으로 계산된 진동 알림 기준값
   */
  @Column({ type: 'int' })
  max_allowed_bpm: number;

  /**
   * 상대적 금기사항 유무
   * true일 경우 무조건 저강도 운동만 추천
   */
  @Column({ type: 'boolean', default: false })
  contraindication: boolean;
}
