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
exports.ExerciseRecord = void 0;
const typeorm_1 = require("typeorm");
const exercise_session_entity_1 = require("./exercise-session.entity");
let ExerciseRecord = class ExerciseRecord {
    record_id;
    session_id;
    session;
    exercise_name;
    duration;
    intensity;
};
exports.ExerciseRecord = ExerciseRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExerciseRecord.prototype, "record_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExerciseRecord.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exercise_session_entity_1.ExerciseSession, (session) => session.records, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", exercise_session_entity_1.ExerciseSession)
], ExerciseRecord.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ExerciseRecord.prototype, "exercise_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ExerciseRecord.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], ExerciseRecord.prototype, "intensity", void 0);
exports.ExerciseRecord = ExerciseRecord = __decorate([
    (0, typeorm_1.Entity)('exercise_record')
], ExerciseRecord);
//# sourceMappingURL=exercise-record.entity.js.map