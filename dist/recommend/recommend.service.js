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
let RecommendService = class RecommendService {
    exerciseRepository;
    tagRepository;
    pregnancyRepository;
    symptomRepository;
    constructor(exerciseRepository, tagRepository, pregnancyRepository, symptomRepository) {
        this.exerciseRepository = exerciseRepository;
        this.tagRepository = tagRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.symptomRepository = symptomRepository;
    }
    isIntensityAllowed(intensity, conditions) {
        const level = intensity ?? 'LOW';
        if (conditions.includes(condition_enum_1.ConditionType.HYPERTENSION)) {
            return level === 'LOW';
        }
        if (conditions.includes(condition_enum_1.ConditionType.ANEMIA) ||
            conditions.includes(condition_enum_1.ConditionType.GESTATIONAL_DIABETES)) {
            return level !== 'HIGH';
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
        const trimester = pregnancy.trimester;
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
        for (const exercise of exercises) {
            if (!exercise.allowed_trimesters?.includes(trimester)) {
                notRecommend.push(exercise);
                continue;
            }
            if (trimester === 2 && exercise.position_type === 'supine') {
                notRecommend.push(exercise);
                continue;
            }
            if (trimester === 3 && exercise.fall_risk) {
                notRecommend.push(exercise);
                continue;
            }
            if (!this.isIntensityAllowed(exercise.intensity, conditionCodes)) {
                notRecommend.push(exercise);
                continue;
            }
            const relatedTags = tagMaps.filter(tag => tag.exercise_id === exercise.exercise_id &&
                symptoms.includes(tag.symptom_name));
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
            if (positiveScore > 0) {
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
        typeorm_2.Repository])
], RecommendService);
//# sourceMappingURL=recommend.service.js.map