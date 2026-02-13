import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';

/**
 * 운동 단계 테이블
 * 단계별 따라가기 기능용
 */
@Entity('exercise_step')
export class ExerciseStep {
  /**
   * 단계 고유 ID
   */
  @PrimaryGeneratedColumn()
  step_id: number;

  /**
   * 어떤 운동에 속하는지 (FK)
   */
  @Column()
  exercise_id: number;

  /**
   * 단계 순서
   * 1, 2, 3 ...
   */
  @Column()
  step_order: number;

  /**
   * 단계 제목
   * 예: 호흡 준비
   */
  @Column({ type: 'varchar', length: 100 })
  title: string;

  /**
   * 단계 설명
   * 예: 편안히 앉아 깊게 숨을 들이마신다.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Exercise와의 관계 설정
   * 하나의 운동은 여러 개의 단계를 가질 수 있음
   */
  @ManyToOne(
    () => Exercise,
    (exercise) => exercise.steps,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}