import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { PregnancyInfo } from './pregnancy-info.entity';
  import { ConditionType } from 'src/common/enums/condition.enum';
  /**
   * PregnancyCondition
   *
   * 임신 중 질환(상대적 금기사항) 저장 테이블
   *
   * 역할:
   * - 한 임신 정보에 대해 여러 질환을 저장 가능
   * - Rule Engine에서 강도 제한 판단에 사용
   * - LLM 설명 생성 시 구체적 근거 데이터로 사용
   */
  @Entity('pregnancy_condition')
  export class PregnancyCondition {
  
    /**
     * PK
     */
    @PrimaryGeneratedColumn()
    id: number;
  
    /**
     * 임신 정보 FK
     */
    @Column()
    pregnancy_id: number;
  
    /**
     * 질환 코드
     * 예:
     * HYPERTENSION
     * ANEMIA
     * GESTATIONAL_DIABETES
     * THYROID
     */
    @Column({
      type: 'enum',
      enum: ConditionType,
    })
    condition_code: ConditionType;
  
    /**
     * PregnancyInfo와의 다대일 관계
     * 임신 정보 삭제 시 함께 삭제
     */
    @ManyToOne(
      () => PregnancyInfo,
      pregnancy => pregnancy.conditions,
      { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'pregnancy_id' })
    pregnancy: PregnancyInfo;
  }