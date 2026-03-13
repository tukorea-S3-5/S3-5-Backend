import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap, EffectType } from '../entities/exercise-tag-map.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,

    @InjectRepository(ExerciseTagMap)
    private readonly tagRepository: Repository<ExerciseTagMap>,
  ) {}

  /**
   * 개인 강도 허용 여부 판단
   */
  private isIntensityAllowed(
    intensity: string | null,
    bmi: number,
    fitnessLevel: string,
  ): boolean {

    const level = intensity ?? 'LOW';

    // BMI 25 이상 → HIGH 제한
    if (bmi >= 25 && level === 'HIGH') {
      return false;
    }

    // 운동 경험 낮음 → LOW만 허용
    if (fitnessLevel === 'LOW' && level !== 'LOW') {
      return false;
    }

    // 중간 체력 → HIGH 제한
    if (fitnessLevel === 'MEDIUM' && level === 'HIGH') {
      return false;
    }

    return true;
  }

  /**
   * 추천 후보 생성
   */
  async generateCandidates(
    trimester: number,
    symptoms: string[],
    bmi: number,
    fitnessLevel: string,
  ): Promise<Exercise[]> {

    /**
     * 1. 전체 운동 조회
     */
    let exercises = await this.exerciseRepository.find();

    /**
     * 2. 분기 허용 여부 필터
     */
    exercises = exercises.filter((exercise) =>
      exercise.allowed_trimesters?.includes(trimester),
    );

    /**
     * 3. 분기별 안전 필터
     */
    if (trimester === 2) {
      exercises = exercises.filter(
        (exercise) => exercise.position_type !== 'SUPINE',
      );
    }

    if (trimester === 3) {
      exercises = exercises.filter(
        (exercise) => !exercise.fall_risk,
      );
    }

    /**
     * 3.5 개인 강도 필터 (BMI + fitness_level)
     */
    exercises = exercises.filter((exercise) =>
      this.isIntensityAllowed(
        exercise.intensity,
        bmi,
        fitnessLevel,
      ),
    );

    /**
     * 4. 남은 운동 ID 목록
     */
    const exerciseIds = exercises.map(
      (exercise) => exercise.exercise_id,
    );

    if (exerciseIds.length === 0) {
      return [];
    }

    /**
     * 5. 증상 매핑 조회
     */
    const tagMaps = await this.tagRepository.find({
      where: {
        exercise_id: In(exerciseIds),
      },
    });

    /**
     * 6. 점수 계산 및 차단 처리
     */
    const scored = exercises.map((exercise) => {

      let score = 0;
      let blocked = false;

      const relatedTags = tagMaps.filter(
        (tag) =>
          tag.exercise_id === exercise.exercise_id &&
          symptoms.includes(tag.symptom_name),
      );

      for (const tag of relatedTags) {

        if (tag.effect_type === 'NEGATIVE') {
          blocked = true;
          break;
        }

        if (
          tag.effect_type === EffectType.POSITIVE_STRONG ||
          tag.effect_type === EffectType.POSITIVE_WEAK
        ) {
          score += 1;
        }
      }

      return {
        exercise,
        score,
        blocked,
      };
    });

    /**
     * 7. 차단 제거
     */
    const filtered = scored.filter(
      (item) => !item.blocked,
    );

    /**
     * 8. 점수 정렬
     */
    filtered.sort((a, b) => b.score - a.score);

    /**
     * 9. 반환
     */
    return filtered.map((item) => item.exercise);
  }
}