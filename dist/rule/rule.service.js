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
exports.RuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_entity_1 = require("../entities/exercise.entity");
const exercise_tag_map_entity_1 = require("../entities/exercise-tag-map.entity");
let RuleService = class RuleService {
    exerciseRepository;
    tagRepository;
    constructor(exerciseRepository, tagRepository) {
        this.exerciseRepository = exerciseRepository;
        this.tagRepository = tagRepository;
    }
    async generateCandidates(trimester, symptoms) {
        let exercises = await this.exerciseRepository.find();
        exercises = exercises.filter((exercise) => exercise.allowed_trimesters?.includes(trimester));
        if (trimester === 2) {
            exercises = exercises.filter((exercise) => exercise.position_type !== 'supine');
        }
        if (trimester === 3) {
            exercises = exercises.filter((exercise) => !exercise.fall_risk);
        }
        const exerciseIds = exercises.map((exercise) => exercise.exercise_id);
        if (exerciseIds.length === 0) {
            return [];
        }
        const tagMaps = await this.tagRepository.find({
            where: {
                exercise_id: (0, typeorm_2.In)(exerciseIds),
            },
        });
        const scored = exercises.map((exercise) => {
            let score = 0;
            let blocked = false;
            const relatedTags = tagMaps.filter((tag) => tag.exercise_id === exercise.exercise_id &&
                symptoms.includes(tag.symptom_name));
            for (const tag of relatedTags) {
                if (tag.effect_type === 'NEGATIVE') {
                    blocked = true;
                    break;
                }
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
        const filtered = scored.filter((item) => !item.blocked);
        filtered.sort((a, b) => b.score - a.score);
        return filtered.map((item) => item.exercise);
    }
};
exports.RuleService = RuleService;
exports.RuleService = RuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_entity_1.Exercise)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_tag_map_entity_1.ExerciseTagMap)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RuleService);
//# sourceMappingURL=rule.service.js.map