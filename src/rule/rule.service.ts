import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';

/**
 * 운동 추천 Rule Engine
 *
 * 처리 순서
 * 1. 전체 운동 조회
 * 2. 분기 필터
 * 3. 분기별 안전 필터 (supine / fall_risk)
 * 4. 증상 매핑 조회
 * 5. NEGATIVE 차단
 * 6. POSITIVE 점수 계산
 * 7. 점수순 정렬
 */
@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,

    @InjectRepository(ExerciseTagMap)
    private readonly tagRepository: Repository<ExerciseTagMap>,
  ) {}

  /**
   * 추천 후보 생성
   *
   * @param trimester 현재 임신 분기
   * @param symptoms 사용자가 선택한 증상 목록
   */
  async generateCandidates(
    trimester: number,
    symptoms: string[],
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

    // 2분기: 누워서 하는 운동 제거
    if (trimester === 2) {
      exercises = exercises.filter(
        (exercise) => exercise.position_type !== 'supine',
      );
    }

    // 3분기: 낙상 위험 운동 제거
    if (trimester === 3) {
      exercises = exercises.filter(
        (exercise) => !exercise.fall_risk,
      );
    }

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
     * 5. 해당 운동들의 증상 매핑 조회
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

        // NEGATIVE 하나라도 있으면 차단
        if (tag.effect_type === 'NEGATIVE') {
          blocked = true;
          break;
        }

        // POSITIVE는 점수 증가
        if (tag.effect_type === 'POSITIVE') {
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
     * 7. 차단된 운동 제거
     */
    const filtered = scored.filter(
      (item) => !item.blocked,
    );

    /**
     * 8. 점수 높은 순 정렬
     */
    filtered.sort((a, b) => b.score - a.score);

    /**
     * 9. Exercise 객체만 반환
     */
    return filtered.map((item) => item.exercise);
  }
}