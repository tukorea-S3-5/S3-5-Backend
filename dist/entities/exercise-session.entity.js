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
exports.ExerciseSession = void 0;
const typeorm_1 = require("typeorm");
const exercise_record_entity_1 = require("./exercise-record.entity");
let ExerciseSession = class ExerciseSession {
    session_id;
    user_id;
    exercise_type;
    started_at;
    ended_at;
    status;
    records;
    created_at;
};
exports.ExerciseSession = ExerciseSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExerciseSession.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ExerciseSession.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ExerciseSession.prototype, "exercise_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ExerciseSession.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], ExerciseSession.prototype, "ended_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ExerciseSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exercise_record_entity_1.ExerciseRecord, (record) => record.session),
    __metadata("design:type", Array)
], ExerciseSession.prototype, "records", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExerciseSession.prototype, "created_at", void 0);
exports.ExerciseSession = ExerciseSession = __decorate([
    (0, typeorm_1.Entity)('exercise_session')
], ExerciseSession);
//# sourceMappingURL=exercise-session.entity.js.map