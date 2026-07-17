"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_entity_1 = require("../entities/exercise.entity");
const exercise_tag_map_entity_1 = require("../entities/exercise-tag-map.entity");
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const symptom_log_entity_1 = require("../entities/symptom-log.entity");
const condition_enum_1 = require("../common/enums/condition.enum");
const ai_service_1 = require("../ai/ai.service");
let RecommendService = class RecommendService {
    exerciseRepository;
    tagRepository;
    pregnancyRepository;
    symptomRepository;
    aiService;
    constructor(exerciseRepository, tagRepository, pregnancyRepository, symptomRepository, aiService) {
        this.exerciseRepository = exerciseRepository;
        this.tagRepository = tagRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.symptomRepository = symptomRepository;
        this.aiService = aiService;
    }
    calculateWeek(lmpInput) {
        const lmp = lmpInput instanceof Date
            ? lmpInput
            : new Date(lmpInput);
        const today = new Date();
        const diffDays = (today.getTime() - lmp.getTime()) /
            (1000 * 60 * 60 * 24);
        return Math.floor(diffDays / 7);
    }
    calculateTrimester(lmp) {
        const week = this.calculateWeek(lmp);
        return Math.ceil(week / 13);
    }
    buildExerciseResult(exercise, aiComment) {
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
    async buildAiComment(params) {
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
    isIntensityAllowed(intensity, conditions, bmi, fitnessLevel) {
        const level = intensity ?? 'LOW';
        if (conditions.includes(condition_enum_1.ConditionType.HYPERTENSION)) {
            return level === 'LOW';
        }
        if (conditions.includes(condition_enum_1.ConditionType.ANEMIA) ||
            conditions.includes(condition_enum_1.ConditionType.GESTATIONAL_DIABETES)) {
            if (level === 'HIGH')
                return false;
        }
        if (bmi >= 25 && level === 'HIGH') {
            return false;
        }
        if (fitnessLevel === 'SEDENTARY' && level !== 'LOW') {
            return false;
        }
        return true;
    }
    async recommend(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { updated_at: 'DESC' },
            relations: ['conditions'],
        });
        if (!pregnancy) {
            throw new common_1.BadRequestException('임신 정보가 존재하지 않습니다.');
        }
        const trimester = this.calculateTrimester(pregnancy.last_menstrual_period);
        const conditionCodes = pregnancy.conditions?.map(c => c.condition_code) ?? [];
        const latestSymptom = await this.symptomRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        const symptoms = latestSymptom?.symptoms ?? [];
        const exercises = await this.exerciseRepository.find();
        const tagMaps = await this.tagRepository.find();
        const recommend = [];
        const caution = [];
        const notRecommend = [];
        outerLoop: for (const exercise of exercises) {
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
            if (!this.isIntensityAllowed(exercise.intensity, conditionCodes, pregnancy.bmi, pregnancy.fitness_level)) {
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
            const relatedTags = tagMaps.filter(tag => tag.exercise_id === exercise.exercise_id &&
                symptoms.includes(tag.symptom_name));
            let hasPositiveStrong = false;
            let hasPositiveWeak = false;
            const positiveReasons = [];
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
            }
            else {
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
};
exports.RecommendService = RecommendService;
exports.RecommendService = RecommendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_entity_1.Exercise)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_tag_map_entity_1.ExerciseTagMap)),
    __param(2, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __param(3, (0, typeorm_1.InjectRepository)(symptom_log_entity_1.SymptomLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService])
], RecommendService);
//# sourceMappingURL=recommend.service.js.map