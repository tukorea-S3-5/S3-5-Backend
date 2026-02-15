"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recommend_controller_1 = require("./recommend.controller");
const recommend_service_1 = require("./recommend.service");
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const exercise_entity_1 = require("../entities/exercise.entity");
const exercise_tag_map_entity_1 = require("../entities/exercise-tag-map.entity");
const symptom_log_entity_1 = require("../entities/symptom-log.entity");
const exercise_step_entity_1 = require("../entities/exercise-step.entity");
let RecommendModule = class RecommendModule {
};
exports.RecommendModule = RecommendModule;
exports.RecommendModule = RecommendModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pregnancy_info_entity_1.PregnancyInfo,
                exercise_entity_1.Exercise,
                exercise_tag_map_entity_1.ExerciseTagMap,
                symptom_log_entity_1.SymptomLog,
                exercise_step_entity_1.ExerciseStep,
            ]),
        ],
        controllers: [recommend_controller_1.RecommendController],
        providers: [recommend_service_1.RecommendService],
        exports: [recommend_service_1.RecommendService],
    })
], RecommendModule);
//# sourceMappingURL=recommend.module.js.map