import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExerciseTagMap } from './exercise-tag-map.entity';
import { ExerciseStep } from './exercise-step.entity';
import { ExerciseCategory } from 'src/common/enums/exercise-category.enum';

/**
 * 운동 마스터 테이블
 * - 추천 대상이 되는 기본 운동 정의 데이터
 * - 실제 수행 기록(exercise_record)과는 별개
 */
@Entity('exercise')
export class Exercise {
  /**
   * 운동 고유 ID (Primary Key)
   */
  @PrimaryGeneratedColumn()
  exercise_id: number;

  /**
   * 운동 이름
   * 예: 걷기, 임산부 요가, 케겔 운동
   */
  @Column({ type: 'varchar', length: 100 })
  exercise_name: string;

  /**
   * 운동 카테고리
   */
  @Column({
    type: 'enum',
    enum: ExerciseCategory,
  })
  category_name: ExerciseCategory;

  /**
   * 운동 강도
   * LOW / MEDIUM / HIGH
   * 추천 화면에서 난이도 참고용
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  intensity: string | null;

  /**
   * 자세 타입
   * standing / seated / supine 등
   * 분기 필터에서 사용됨
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  position_type: string | null;

  /**
   * 낙상 위험 여부
   * 3분기 필터링에서 사용
   */
  @Column({ type: 'boolean', default: false })
  fall_risk: boolean;

  /**
   * 허용 임신 분기
   * 예: [1,2,3]
   * 분기 기반 추천 필터에 사용
   */
  @Column({ type: 'json', nullable: true })
  allowed_trimesters: number[];

  /**
   * 운동 간단 설명
   * 추천 카드에 표시되는 요약 설명
   */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * 난이도 표시용 라벨
   * 예: 초급 / 중급 / 고급
   * UI에서 뱃지처럼 표시하기 위함
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  difficulty_label: string | null;

  /**
   * 영상 URL
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  video_url: string | null;

  /**
   * 운동 단계 리스트 (1:N 관계)
   * exercise_step 테이블과 연결
   * 단계별 따라가기 기능에서 사용
   */
  @OneToMany(() => ExerciseStep, (step) => step.exercise)
  steps: ExerciseStep[];

  /**
   * 증상 매핑 관계 (1:N)
   * exercise_tag_map 테이블과 연결
   * Rule Engine에서 사용
   */
  @OneToMany(() => ExerciseTagMap, (tagMap) => tagMap.exercise)
  tagMaps: ExerciseTagMap[];
}
