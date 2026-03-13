import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { ConditionType } from 'src/common/enums/condition.enum';
import { SymptomType } from '../common/enums/symptom.enum';

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

    // 고혈압 → LOW만 허용
    if (conditions.includes(ConditionType.HYPERTENSION)) {
      return level === 'LOW';
    }

    // 빈혈 / 임신성 당뇨 → HIGH 제외
    if (
      conditions.includes(ConditionType.ANEMIA) ||
      conditions.includes(ConditionType.GESTATIONAL_DIABETES)
    ) {
      if (level === 'HIGH') return false;
    }

    // BMI 제한
    if (bmi >= 25 && level === 'HIGH') {
      return false;
    }

    // 운동 숙련도 제한
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
 * - 분기 동적 계산
 * - 질환 필터
 * - 증상 필터
 */
  async recommend(userId: string) {

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

    const recommend: any[] = [];
    const caution: any[] = [];
    const notRecommend: any[] = [];

    outerLoop:
    for (const exercise of exercises) {

      let score = 0;
      let reasons: string[] = [];

      /**
       * 1. 안전 차단 레이어
       */

      if (!exercise.allowed_trimesters?.includes(trimester)) {
        notRecommend.push({
          ...exercise,
          reason: ['임신 분기 제한'],
        });
        continue;
      }

      if (trimester === 2 && exercise.position_type === 'SUPINE') {
        notRecommend.push({
          ...exercise,
          reason: ['2분기 supine 제한'],
        });
        continue;
      }

      if (trimester === 3 && exercise.fall_risk) {
        notRecommend.push({
          ...exercise,
          reason: ['3분기 낙상 위험'],
        });
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
        notRecommend.push({
          ...exercise,
          reason: ['강도 제한'],
        });
        continue;
      }

      /**
       * 2. 기본 강도 점수 부여
       */

      if (exercise.intensity === 'LOW') score += 2;
      else if (exercise.intensity === 'MEDIUM') score += 1;

      /**
       * 3. 증상 가중치 적용
       */

      const relatedTags = tagMaps.filter(
        tag =>
          tag.exercise_id === exercise.exercise_id &&
          symptoms.includes(tag.symptom_name),
      );

      for (const tag of relatedTags) {

        if (tag.effect_type === 'NEGATIVE') {
          notRecommend.push({
            ...exercise,
            reason: ['해당 증상 악화 가능성'],
          });
          continue outerLoop;
        }

        if (tag.effect_type === 'POSITIVE_STRONG') {
          score += 2;
          reasons.push('증상 직접 완화 효과');
        }

        if (tag.effect_type === 'POSITIVE_WEAK') {
          score += 1;
          reasons.push('증상 간접 완화 효과');
        }
      }

      /**
       * 4. 최종 분류
       */

      if (score >= 3) {
        recommend.push({
          ...exercise,
          reason: reasons.length ? reasons : ['현재 상태에 적합한 운동'],
        });
      } else if (score >= 1) {
        caution.push({
          ...exercise,
          reason: reasons.length ? reasons : ['안전 범위 내 운동'],
        });
      } else {
        notRecommend.push({
          ...exercise,
          reason: ['현재 상태에 적합하지 않음'],
        });
      }
    }

    return {
      recommend,
      caution,
      not_recommend: notRecommend,
    };
  }
}