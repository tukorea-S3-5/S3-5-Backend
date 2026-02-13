"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pregnancy_info_entity_1 = require("./pregnancy-info.entity");
const health_baseline_entity_1 = require("./health-baseline.entity");
const exercise_session_entity_1 = require("./exercise-session.entity");
const exercise_record_entity_1 = require("./exercise-record.entity");
const symptom_log_entity_1 = require("./symptom-log.entity");
const heart_rate_log_entity_1 = require("./heart-rate-log.entity");
const report_entity_1 = require("./report.entity");
const recommendation_entity_1 = require("./recommendation.entity");
const exercise_entity_1 = require("./exercise.entity");
const exercise_tag_map_entity_1 = require("./exercise-tag-map.entity");
let EntitiesModule = class EntitiesModule {
};
exports.EntitiesModule = EntitiesModule;
exports.EntitiesModule = EntitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pregnancy_info_entity_1.PregnancyInfo,
                health_baseline_entity_1.HealthBaseline,
                exercise_entity_1.Exercise,
                exercise_tag_map_entity_1.ExerciseTagMap,
                exercise_session_entity_1.ExerciseSession,
                exercise_record_entity_1.ExerciseRecord,
                symptom_log_entity_1.SymptomLog,
                heart_rate_log_entity_1.HeartRateLog,
                report_entity_1.Report,
                recommendation_entity_1.Recommendation,
            ]),
        ],
    })
], EntitiesModule);
//# sourceMappingURL=entities.module.js.map