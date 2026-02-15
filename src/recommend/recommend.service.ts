import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';

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

  async recommend(userId: string) {

    /**
     * 1️. 최신 임신 정보 조회
     */
    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
    });

    if (!pregnancy) {
      throw new BadRequestException('임신 정보가 존재하지 않습니다.');
    }

    const trimester = pregnancy.trimester;

    /**
     * 2️. 최신 증상 세트 조회 (JSON 배열)
     */
    const latestSymptom = await this.symptomRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },  
    });

    if (!latestSymptom) {
      throw new BadRequestException('증상이 입력되지 않았습니다.');
    }

    const symptoms: string[] = latestSymptom.symptoms; // 바로 배열

    /**
     * 3️. 전체 운동 조회
     */
    let exercises = await this.exerciseRepository.find();

    /**
     * 4️. 분기 필터
     */
    exercises = exercises.filter((exercise) =>
      exercise.allowed_trimesters?.includes(trimester),
    );

    if (trimester === 2) {
      exercises = exercises.filter(
        (exercise) => exercise.position_type !== 'supine',
      );
    }

    if (trimester === 3) {
      exercises = exercises.filter(
        (exercise) => exercise.fall_risk === false,
      );
    }

    /**
     * 5️. 증상 매핑 조회
     */
    const exerciseIds = exercises.map((e) => e.exercise_id);

    const tagMaps = await this.tagRepository.find({
      where: {
        exercise_id: In(exerciseIds),
      },
    });

    /**
     * 6️. 분류
     */
    const recommend: Exercise[] = [];
    const caution: Exercise[] = [];
    const notRecommend: Exercise[] = [];

    for (const exercise of exercises) {
      let score = 0;
      let isNegative = false;

      const relatedTags = tagMaps.filter(
        (tag) =>
          tag.exercise_id === exercise.exercise_id &&
          symptoms.includes(tag.symptom_name),
      );

      for (const tag of relatedTags) {
        if (tag.effect_type === 'NEGATIVE') {
          isNegative = true;
          break;
        }

        if (tag.effect_type === 'POSITIVE') {
          score += 1;
        }
      }

      if (isNegative) {
        notRecommend.push(exercise);
        continue;
      }

      if (score > 0) {
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