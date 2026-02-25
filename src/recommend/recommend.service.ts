import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { ConditionType } from 'src/common/enums/condition.enum';
import { SymptomType } from 'src/common/enums/symptom.enum';

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
  ) {}

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
      return level !== 'HIGH';
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

    /**
     * DB에서 trimester를 읽지 않음
     * LMP 기준으로 매번 계산
     */
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

    const recommend: Exercise[] = [];
    const caution: Exercise[] = [];
    const notRecommend: Exercise[] = [];

    for (const exercise of exercises) {

      /**
       * 1️. 분기 허용 여부
       */
      if (!exercise.allowed_trimesters?.includes(trimester)) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 2️. 2분기 supine 제한
       */
      if (
        trimester === 2 &&
        exercise.position_type === 'supine'
      ) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 3️. 3분기 낙상 위험 제한
       */
      if (
        trimester === 3 &&
        exercise.fall_risk
      ) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 4️. 질환 강도 제한
       */
      if (
        !this.isIntensityAllowed(
          exercise.intensity,
          conditionCodes,
        )
      ) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 5️. 증상 기반 판정
       */
      const relatedTags = tagMaps.filter(
        tag =>
          tag.exercise_id === exercise.exercise_id &&
          symptoms.includes(tag.symptom_name),
      );

      let hasNegative = false;
      let positiveScore = 0;

      for (const tag of relatedTags) {

        if (tag.effect_type === 'NEGATIVE') {
          hasNegative = true;
          break;
        }

        if (tag.effect_type === 'POSITIVE') {
          positiveScore++;
        }
      }

      if (hasNegative) {
        notRecommend.push(exercise);
        continue;
      }

      // 긍정 효과 있으면 추천
      if (positiveScore > 0) {
        recommend.push(exercise);
        continue;
      }

      /**
       * 증상 없거나,
       * LOW 강도면 기본 추천
       */
      if (
        symptoms.length === 0 ||
        exercise.intensity === 'LOW'
      ) {
        recommend.push(exercise);
        continue;
      }

      caution.push(exercise);
    }

    return {
      recommend,
      caution,
      not_recommend: notRecommend,
    };
  }
}