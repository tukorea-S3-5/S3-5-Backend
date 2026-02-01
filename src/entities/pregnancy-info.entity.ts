import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
  } from 'typeorm';
  
  /**
   * 임신 정보 테이블
   * - 사용자별 임신 진행 상황 관리
   * - 임신 주차, 체중 변화, 예정일 관리 목적
   */
  @Entity('pregnancy_info')
  export class PregnancyInfo {
    /**
     * 임신 정보 PK
     */
    @PrimaryGeneratedColumn()
    pregnancy_id: number;
  
    /**
     * 사용자 ID (FK)
     * users.user_id 참조
     */
    @Column({ type: 'uuid' })
    user_id: string;
  
    /**
     * 임신 분기 (1~3분기)
     */
    @Column({ type: 'int', nullable: true })
    trimester: number;
  
    /**
     * 임신 주차 (0~42주)
     */
    @Column({ type: 'int', nullable: true })
    week: number;
  
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
     * 현재 체중 (kg)
     */
    @Column({ type: 'float' })
    current_weight: number;
  
    /**
     * BMI (자동 계산 또는 저장용)
     */
    @Column({ type: 'float', nullable: true })
    bmi: number;
  
    /**
     * 임신 시작일
     */
    @Column({ type: 'date' })
    pregnancy_start_date: Date;
  
    /**
     * 출산 예정일 (변경 가능)
     */
    @Column({ type: 'date', nullable: true })
    due_date: Date;
  
    /**
     * 마지막 수정 시각
     */
    @UpdateDateColumn()
    updated_at: Date;
  }
  