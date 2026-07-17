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
import { AiService } from '../ai/ai.service';

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

    private readonly aiService: AiService,
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

  private buildExerciseResult(
    exercise: Exercise,
    aiComment?: string,
  ): ExerciseResultDto {
    return {
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
      ai_comment: aiComment,
    };
  }

  private async buildAiComment(params: {
    type: 'recommend' | 'caution' | 'not_recommend';
    pregnancy: PregnancyInfo;
    trimester: number;
    symptoms: SymptomType[];
    conditionCodes: ConditionType[];
    exercise: Exercise;
    ruleReasons: string[];
  }): Promise<string> {
    return this.aiService.generateRecommendationComment({
      type: params.type,
      week: this.calculateWeek(params.pregnancy.last_menstrual_period),
      trimester: params.trimester,
      bmi: params.pregnancy.bmi,
      symptoms: params.symptoms,
      conditions: params.conditionCodes,
      exercise: {
        name: params.exercise.exercise_name,
        category: params.exercise.category_name,
        intensity: params.exercise.intensity ?? '',
        positionType: params.exercise.position_type ?? '',
        fallRisk: params.exercise.fall_risk,
        description: params.exercise.description ?? '',
      },
      ruleReasons: params.ruleReasons,
    });
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

    if (fitnessLevel === 'SEDENTARY' && level !== 'LOW') {
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

      /**
       * 1. 절대 안전 차단 필터
       */

      if (!exercise.allowed_trimesters?.includes(trimester)) {
        const aiComment = await this.buildAiComment({
          type: 'not_recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: [`${trimester}분기 허용 운동 목록에 포함되지 않음`],
        });
        notRecommend.push(this.buildExerciseResult(exercise, aiComment));
        continue;
      }

      if (trimester === 2 && exercise.position_type === 'SUPINE') {
        const aiComment = await this.buildAiComment({
          type: 'not_recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: ['2분기에는 바로 누운 자세 운동 제한'],
        });
        notRecommend.push(this.buildExerciseResult(exercise, aiComment));
        continue;
      }

      if (trimester === 3 && exercise.fall_risk) {
        const aiComment = await this.buildAiComment({
          type: 'not_recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: ['3분기에는 낙상 위험 운동 제한'],
        });
        notRecommend.push(this.buildExerciseResult(exercise, aiComment));
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
        const aiComment = await this.buildAiComment({
          type: 'not_recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: [
            `기저 질환, BMI(${pregnancy.bmi}), 운동 수준(${pregnancy.fitness_level}) 기준에서 강도 제한`,
          ],
        });
        notRecommend.push(this.buildExerciseResult(exercise, aiComment));
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
      const positiveReasons: string[] = [];

      for (const tag of relatedTags) {

        if (tag.effect_type === 'NEGATIVE') {
          const aiComment = await this.buildAiComment({
            type: 'not_recommend',
            pregnancy,
            trimester,
            symptoms,
            conditionCodes,
            exercise,
            ruleReasons: [`현재 증상(${tag.symptom_name})에 부정 영향 태그 존재`],
          });
          notRecommend.push(this.buildExerciseResult(exercise, aiComment));
          continue outerLoop;
        }

        if (tag.effect_type === 'POSITIVE_STRONG') {
          hasPositiveStrong = true;
          positiveReasons.push(`현재 증상(${tag.symptom_name})에 강한 긍정 태그`);
        }

        if (tag.effect_type === 'POSITIVE_WEAK') {
          hasPositiveWeak = true;
          positiveReasons.push(`현재 증상(${tag.symptom_name})에 긍정 태그`);
        }
      }

      /**
       * 3. 최종 분류
       */

      if (hasPositiveStrong) {
        const aiComment = await this.buildAiComment({
          type: 'recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: positiveReasons,
        });
        recommend.push(this.buildExerciseResult(exercise, aiComment));
        continue;
      }

      if (hasPositiveWeak) {
        const aiComment = await this.buildAiComment({
          type: 'recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: positiveReasons,
        });
        recommend.push(this.buildExerciseResult(exercise, aiComment));
        continue;
      }

      // 증상과 무관하지만 안전하면 기본 추천
      if (symptoms.length === 0) {
        const aiComment = await this.buildAiComment({
          type: 'recommend',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: ['임신 분기, 자세, 낙상 위험, 개인 강도 기준 통과'],
        });
        recommend.push(this.buildExerciseResult(exercise, aiComment));
      } else {
        const aiComment = await this.buildAiComment({
          type: 'caution',
          pregnancy,
          trimester,
          symptoms,
          conditionCodes,
          exercise,
          ruleReasons: [
            '안전 필터는 통과했지만 최신 증상과 직접적인 긍정 태그가 없어 주의 운동으로 분류',
          ],
        });
        caution.push(this.buildExerciseResult(exercise, aiComment));
      }
    }

    return {
      recommend,
      caution,
      not_recommend: notRecommend,
    };
  }
}
