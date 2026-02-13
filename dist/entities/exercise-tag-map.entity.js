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
exports.ExerciseTagMap = void 0;
const typeorm_1 = require("typeorm");
const exercise_entity_1 = require("./exercise.entity");
let ExerciseTagMap = class ExerciseTagMap {
    map_id;
    exercise_id;
    symptom_name;
    effect_type;
    exercise;
};
exports.ExerciseTagMap = ExerciseTagMap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExerciseTagMap.prototype, "map_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExerciseTagMap.prototype, "exercise_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ExerciseTagMap.prototype, "symptom_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ExerciseTagMap.prototype, "effect_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exercise_entity_1.Exercise, (exercise) => exercise.tagMaps),
    (0, typeorm_1.JoinColumn)({ name: 'exercise_id' }),
    __metadata("design:type", exercise_entity_1.Exercise)
], ExerciseTagMap.prototype, "exercise", void 0);
exports.ExerciseTagMap = ExerciseTagMap = __decorate([
    (0, typeorm_1.Entity)('exercise_tag_map')
], ExerciseTagMap);
//# sourceMappingURL=exercise-tag-map.entity.js.map