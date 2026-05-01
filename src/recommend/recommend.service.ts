import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { ConditionType } from 'src/common/enums/condition.enum';
import { SymptomType } from '../common/enums/symptom.enum';
import { RecommendResponseDto } from './dto/recommend-response.dto';
import { ExerciseResultDto } from './dto/exercise-result.dto';

@Injectable()
export class RecommendService {

  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,

    @InjectRepository(ExerciseTagMap)
    private readonly tagRepository: Repository<ExerciseTagMap>,

    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,

    @InjectRepository(SymptomLog)
    private readonly symptomRepository: Repository<SymptomLog>,
  ) { }

  /**
   * 임신 주차 계산 (LMP 기준)
   */
  private calculateWeek(lmpInput: Date | string): number {
    const lmp =
      lmpInput instanceof Date
        ? lmpInput
        : new Date(lmpInput);

    const today = new Date();

    const diffDays =
      (today.getTime() - lmp.getTime()) /
      (1000 * 60 * 60 * 24);

    return Math.floor(diffDays / 7);
  }

  /**
   * 분기 계산
   */
  private calculateTrimester(lmp: Date): number {
    const week = this.calculateWeek(lmp);
    return Math.ceil(week / 13);
  }

  /**
   * 질환 강도 허용 여부 판단
   */
  private isIntensityAllowed(
    intensity: string | null,
    conditions: ConditionType[],
    bmi: number,
    fitnessLevel: string,
  ): boolean {

    const level = intensity ?? 'LOW';

    if (conditions.includes(ConditionType.HYPERTENSION)) {
      return level === 'LOW';
    }

    if (
      conditions.includes(ConditionType.ANEMIA) ||
      conditions.includes(ConditionType.GESTATIONAL_DIABETES)
    ) {
      if (level === 'HIGH') return false;
    }

    if (bmi >= 25 && level === 'HIGH') {
      return false;
    }

    if (fitnessLevel === 'LOW' && level !== 'LOW') {
      return false;
    }

    if (fitnessLevel === 'MEDIUM' && level === 'HIGH') {
      return false;
    }

    return true;
  }

  /**
   * 운동 추천 메인 로직
   * - 안전 필터 기반 구조
   * - 증상 중심 추천
   */
  async recommend(userId: string): Promise<RecommendResponseDto> {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
      relations: ['conditions'],
    });

    if (!pregnancy) {
      throw new BadRequestException('임신 정보가 존재하지 않습니다.');
    }

    const trimester =
      this.calculateTrimester(
        pregnancy.last_menstrual_period,
      );

    const conditionCodes: ConditionType[] =
      pregnancy.conditions?.map(
        c => c.condition_code,
      ) ?? [];

    const latestSymptom =
      await this.symptomRepository.findOne({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
      });

    const symptoms: SymptomType[] =
      latestSymptom?.symptoms ?? [];

    const exercises =
      await this.exerciseRepository.find();

    const tagMaps =
      await this.tagRepository.find();

    const recommend: ExerciseResultDto[] = [];
    const caution: ExerciseResultDto[] = [];
    const notRecommend: ExerciseResultDto[] = [];

    outerLoop:
    for (const exercise of exercises) {

      const base: ExerciseResultDto = {
        exercise_id: exercise.exercise_id,
        exercise_name: exercise.exercise_name,
        category_name: exercise.category_name,
        intensity: exercise.intensity ?? '',
        position_type: exercise.position_type ?? '',
        fall_risk: exercise.fall_risk,
        allowed_trimesters: exercise.allowed_trimesters,
        description: exercise.description ?? '',
        difficulty_label: exercise.difficulty_label ?? '',
        video_url: exercise.video_url ?? null,
      };

      /**
       * 1. 절대 안전 차단 필터
       */

      if (!exercise.allowed_trimesters?.includes(trimester)) {
        notRecommend.push(base);
        continue;
      }

      if (trimester === 2 && exercise.position_type === 'SUPINE') {
        notRecommend.push(base);
        continue;
      }

      if (trimester === 3 && exercise.fall_risk) {
        notRecommend.push(base);
        continue;
      }

      if (
        !this.isIntensityAllowed(
          exercise.intensity,
          conditionCodes,
          pregnancy.bmi,
          pregnancy.fitness_level,
        )
      ) {
        notRecommend.push(base);
        continue;
      }

      /**
       * 2. 증상 기반 필터
       */

      const relatedTags = tagMaps.filter(
        tag =>
          tag.exercise_id === exercise.exercise_id &&
          symptoms.includes(tag.symptom_name),
      );

      let hasPositiveStrong = false;
      let hasPositiveWeak = false;

      for (const tag of relatedTags) {

        if (tag.effect_type === 'NEGATIVE') {
          notRecommend.push(base);
          continue outerLoop;
        }

        if (tag.effect_type === 'POSITIVE_STRONG') {
          hasPositiveStrong = true;
        }

        if (tag.effect_type === 'POSITIVE_WEAK') {
          hasPositiveWeak = true;
        }
      }

      /**
       * 3. 최종 분류
       */

      if (hasPositiveStrong) {
        recommend.push(base);
        continue;
      }

      if (hasPositiveWeak) {
        recommend.push(base);
        continue;
      }

      // 증상과 무관하지만 안전하면 기본 추천
      if (symptoms.length === 0) {
        recommend.push(base);
      } else {
        caution.push(base);
      }
    }

    return {
      recommend,
      caution,
      not_recommend: notRecommend,
    };
  }
}