import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

/**
 * 임신 정보 테이블
 * 사용자별 임신 진행 상태를 저장한다.
 */
@Entity('pregnancy_info')
export class PregnancyInfo {
  @PrimaryGeneratedColumn()
  pregnancy_id: number;

  /**
   * 사용자 FK
   */
  @Column({ type: 'uuid' })
  user_id: string;

  /**
   * User 엔티티와의 관계
   * 여러 임신 정보가 하나의 사용자에 속한다.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  trimester: number;

  @Column({ type: 'int', nullable: true })
  week: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  pre_weight: number;

  @Column({ type: 'float' })
  current_weight: number;

  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({ type: 'date' })
  pregnancy_start_date: Date;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
