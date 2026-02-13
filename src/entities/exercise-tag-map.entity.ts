import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';

/**
 * 운동 ↔ 증상 매핑 테이블
 * - 특정 증상에 대해 해당 운동이
 *   도움이 되는지 / 악화시키는지 정의
 */
@Entity('exercise_tag_map')
export class ExerciseTagMap {
  /**
   * 매핑 고유 ID
   */
  @PrimaryGeneratedColumn()
  map_id: number;

  /**
   * 운동 ID (FK)
   */
  @Column()
  exercise_id: number;

  /**
   * 증상 이름
   * 예: 요통, 골반통증
   */
  @Column({ type: 'varchar', length: 100 })
  symptom_name: string;

  /**
   * 영향 타입
   * POSITIVE: 완화
   * NEGATIVE: 악화 위험
   */
  @Column({ type: 'varchar', length: 20 })
  effect_type: 'POSITIVE' | 'NEGATIVE';

  /**
   * 운동과의 관계 설정
   */
  @ManyToOne(() => Exercise, (exercise) => exercise.tagMaps)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}