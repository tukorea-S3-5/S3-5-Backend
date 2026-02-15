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
    async recommend(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { updated_at: 'DESC' },
        });
        if (!pregnancy) {
            throw new common_1.BadRequestException('임신 정보가 존재하지 않습니다.');
        }
        const trimester = pregnancy.trimester;
        const latestSymptom = await this.symptomRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        if (!latestSymptom) {
            throw new common_1.BadRequestException('증상이 입력되지 않았습니다.');
        }
        const symptoms = latestSymptom.symptoms;
        let exercises = await this.exerciseRepository.find();
        exercises = exercises.filter((exercise) => exercise.allowed_trimesters?.includes(trimester));
        if (trimester === 2) {
            exercises = exercises.filter((exercise) => exercise.position_type !== 'supine');
        }
        if (trimester === 3) {
            exercises = exercises.filter((exercise) => exercise.fall_risk === false);
        }
        const exerciseIds = exercises.map((e) => e.exercise_id);
        const tagMaps = await this.tagRepository.find({
            where: {
                exercise_id: (0, typeorm_2.In)(exerciseIds),
            },
        });
        const recommend = [];
        const caution = [];
        const notRecommend = [];
        for (const exercise of exercises) {
            let score = 0;
            let isNegative = false;
            const relatedTags = tagMaps.filter((tag) => tag.exercise_id === exercise.exercise_id &&
                symptoms.includes(tag.symptom_name));
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