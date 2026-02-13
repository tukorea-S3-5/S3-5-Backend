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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = void 0;
const typeorm_1 = require("typeorm");
const exercise_tag_map_entity_1 = require("./exercise-tag-map.entity");
const exercise_step_entity_1 = require("./exercise-step.entity");
let Exercise = class Exercise {
    exercise_id;
    exercise_name;
    category_name;
    intensity;
    position_type;
    fall_risk;
    allowed_trimesters;
    description;
    difficulty_label;
    steps;
    tagMaps;
};
exports.Exercise = Exercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Exercise.prototype, "exercise_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Exercise.prototype, "exercise_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Exercise.prototype, "category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Exercise.prototype, "intensity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Exercise.prototype, "position_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Exercise.prototype, "fall_risk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Exercise.prototype, "allowed_trimesters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Exercise.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Exercise.prototype, "difficulty_label", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exercise_step_entity_1.ExerciseStep, (step) => step.exercise),
    __metadata("design:type", Array)
], Exercise.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exercise_tag_map_entity_1.ExerciseTagMap, (tagMap) => tagMap.exercise),
    __metadata("design:type", Array)
], Exercise.prototype, "tagMaps", void 0);
exports.Exercise = Exercise = __decorate([
    (0, typeorm_1.Entity)('exercise')
], Exercise);
//# sourceMappingURL=exercise.entity.js.map