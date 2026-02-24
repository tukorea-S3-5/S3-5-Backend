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
   * 질환 강도 허용 여부 판단
   */
  private isIntensityAllowed(
    intensity: string | null,
    conditions: ConditionType[],
  ): boolean {

    const level = intensity ?? 'LOW';

    if (conditions.includes(ConditionType.HYPERTENSION)) {
      return level === 'LOW';
    }

    if (
      conditions.includes(ConditionType.ANEMIA) ||
      conditions.includes(ConditionType.GESTATIONAL_DIABETES)
    ) {
      return level !== 'HIGH';
    }

    return true;
  }

  async recommend(userId: string) {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
      relations: ['conditions'],
    });

    if (!pregnancy) {
      throw new BadRequestException('임신 정보가 존재하지 않습니다.');
    }

    const trimester = pregnancy.trimester;
    const conditionCodes: ConditionType[] =
      pregnancy.conditions?.map(c => c.condition_code) ?? [];

    const latestSymptom = await this.symptomRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    const symptoms: SymptomType[] =
      latestSymptom?.symptoms ?? [];

    const exercises = await this.exerciseRepository.find();
    const tagMaps = await this.tagRepository.find();

    const recommend: Exercise[] = [];
    const caution: Exercise[] = [];
    const notRecommend: Exercise[] = [];

    for (const exercise of exercises) {

      /**
       * 1. 분기 허용 여부
       */
      if (!exercise.allowed_trimesters?.includes(trimester)) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 2. 2분기 supine 제한
       */
      if (trimester === 2 && exercise.position_type === 'supine') {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 3. 3분기 낙상 위험
       */
      if (trimester === 3 && exercise.fall_risk) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 4. 질환 강도 제한
       */
      if (!this.isIntensityAllowed(exercise.intensity, conditionCodes)) {
        notRecommend.push(exercise);
        continue;
      }

      /**
       * 5. 증상 기반 판정
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

      // if (positiveScore > 0) {
      //   recommend.push(exercise);
      //   continue;
      // }

      // caution.push(exercise);

      if (positiveScore > 0) {
        recommend.push(exercise);
        continue;
      }
      
      // 증상 없거나, 관련 없어도
      // 안전하면 기본 recommend
      if (symptoms.length === 0 || exercise.intensity === 'LOW') {
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