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
exports.ExerciseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_session_entity_1 = require("../entities/exercise-session.entity");
const exercise_record_entity_1 = require("../entities/exercise-record.entity");
const exercise_entity_1 = require("../entities/exercise.entity");
const exercise_step_entity_1 = require("../entities/exercise-step.entity");
let ExerciseService = class ExerciseService {
    sessionRepository;
    recordRepository;
    exerciseRepository;
    stepRepository;
    constructor(sessionRepository, recordRepository, exerciseRepository, stepRepository) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.exerciseRepository = exerciseRepository;
        this.stepRepository = stepRepository;
    }
    async startSession(userId) {
        const session = this.sessionRepository.create({
            user_id: userId,
            status: 'ONGOING',
            started_at: new Date(),
        });
        return this.sessionRepository.save(session);
    }
    async endSession(userId) {
        const session = await this.sessionRepository.findOne({
            where: { user_id: userId, status: 'ONGOING' },
        });
        if (!session) {
            throw new common_1.BadRequestException('진행 중인 전체 운동이 없습니다.');
        }
        session.status = 'COMPLETED';
        session.ended_at = new Date();
        return this.sessionRepository.save(session);
    }
    async startRecord(userId, exerciseName, orderIndex) {
        const record = this.recordRepository.create({
            user_id: userId,
            exercise_name: exerciseName,
            order_index: orderIndex,
            started_at: new Date(),
            session_id: null,
        });
        return this.recordRepository.save(record);
    }
    async endRecord(recordId) {
        const record = await this.recordRepository.findOne({
            where: { record_id: recordId },
        });
        if (!record || record.ended_at) {
            throw new common_1.BadRequestException('종료할 운동 기록이 없습니다.');
        }
        record.ended_at = new Date();
        record.duration = Math.floor((record.ended_at.getTime() - record.started_at.getTime()) / 1000);
        return this.recordRepository.save(record);
    }
    async getHistory(userId) {
        const sessions = await this.sessionRepository.find({
            where: {
                user_id: userId,
                status: 'COMPLETED',
            },
            relations: ['records'],
            order: { started_at: 'DESC' },
        });
        const singleRecords = await this.recordRepository.find({
            where: {
                user_id: userId,
                session_id: (0, typeorm_2.IsNull)(),
                ended_at: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
            },
            order: { started_at: 'DESC' },
        });
        return {
            sessions,
            single_records: singleRecords,
        };
    }
    async getAllExercises() {
        return this.exerciseRepository.find({
            order: { exercise_id: 'ASC' },
        });
    }
    async getExerciseDetail(exerciseId) {
        const exercise = await this.exerciseRepository.findOne({
            where: { exercise_id: exerciseId },
        });
        if (!exercise) {
            throw new common_1.BadRequestException('운동이 존재하지 않습니다.');
        }
        const steps = await this.stepRepository.find({
            where: { exercise_id: exerciseId },
            order: { step_order: 'ASC' },
        });
        return {
            ...exercise,
            steps,
        };
    }
};
exports.ExerciseService = ExerciseService;
exports.ExerciseService = ExerciseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_session_entity_1.ExerciseSession)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_record_entity_1.ExerciseRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(exercise_entity_1.Exercise)),
    __param(3, (0, typeorm_1.InjectRepository)(exercise_step_entity_1.ExerciseStep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExerciseService);
//# sourceMappingURL=exercise.service.js.map