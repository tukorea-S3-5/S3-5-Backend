import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';
import { SymptomType } from 'src/common/enums/symptom.enum';

/**
 * 운동 ↔ 증상 매핑 테이블
 *
 * 특정 증상에 대해
 * 해당 운동이 긍정/부정 영향을 주는지 정의
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
   * 증상 코드 (enum)
   * 예: BACK_PAIN, FATIGUE
   */
  @Column({
    type: 'enum',
    enum: SymptomType,
  })
  symptom_name: SymptomType;

  /**
   * 영향 타입
   * POSITIVE: 완화
   * NEGATIVE: 악화 위험
   */
  @Column({
    type: 'enum',
    enum: ['POSITIVE', 'NEGATIVE'],
  })
  effect_type: 'POSITIVE' | 'NEGATIVE';

  /**
   * 운동과의 관계
   */
  @ManyToOne(
    () => Exercise,
    (exercise) => exercise.tagMaps,
  )
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}