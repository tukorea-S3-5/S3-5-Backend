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
const recommend_service_1 = require("../recommend/recommend.service");
let ExerciseService = class ExerciseService {
    sessionRepository;
    recordRepository;
    recommendService;
    constructor(sessionRepository, recordRepository, recommendService) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.recommendService = recommendService;
    }
    async startRecommendedSession(userId) {
        const result = await this.recommendService.recommend(userId);
        if (!result.recommend.length) {
            throw new common_1.BadRequestException('추천 운동이 없습니다.');
        }
        const session = await this.sessionRepository.save(this.sessionRepository.create({
            user_id: userId,
            status: 'ONGOING',
            total_duration: 0,
        }));
        const createdRecords = [];
        for (let i = 0; i < result.recommend.length; i++) {
            const record = await this.recordRepository.save(this.recordRepository.create({
                user_id: userId,
                session_id: session.session_id,
                exercise_id: result.recommend[i].exercise_id,
                exercise_name: result.recommend[i].exercise_name,
                order_index: i + 1,
                started_at: i === 0 ? new Date() : null,
            }));
            createdRecords.push(record);
        }
        return {
            session,
            records: createdRecords,
        };
    }
    async startSelectedRecords(userId, exerciseIds) {
        const result = await this.recommendService.recommend(userId);
        const allowedExercises = result.recommend.filter((ex) => exerciseIds.includes(ex.exercise_id));
        if (!allowedExercises.length) {
            throw new common_1.BadRequestException('선택한 운동이 추천 목록에 없습니다.');
        }
        const session = await this.sessionRepository.save(this.sessionRepository.create({
            user_id: userId,
            status: 'ONGOING',
            total_duration: 0,
        }));
        const createdRecords = [];
        for (let i = 0; i < allowedExercises.length; i++) {
            const record = await this.recordRepository.save(this.recordRepository.create({
                user_id: userId,
                session_id: session.session_id,
                exercise_id: allowedExercises[i].exercise_id,
                exercise_name: allowedExercises[i].exercise_name,
                order_index: i + 1,
                started_at: i === 0 ? new Date() : null,
            }));
            createdRecords.push(record);
        }
        return {
            session,
            records: createdRecords,
        };
    }
    async endRecord(recordId) {
        const record = await this.recordRepository.findOne({
            where: { record_id: recordId },
        });
        if (!record) {
            throw new common_1.BadRequestException('운동 기록이 없습니다.');
        }
        if (!record.started_at) {
            throw new common_1.BadRequestException('아직 시작되지 않은 운동입니다.');
        }
        if (record.ended_at) {
            throw new common_1.BadRequestException('이미 종료된 운동입니다.');
        }
        record.ended_at = new Date();
        const additional = Math.floor((record.ended_at.getTime() -
            record.started_at.getTime()) / 1000);
        record.duration = (record.duration ?? 0) + additional;
        await this.recordRepository.save(record);
        const nextRecord = await this.recordRepository.findOne({
            where: {
                user_id: record.user_id,
                session_id: record.session_id === null
                    ? (0, typeorm_2.IsNull)()
                    : record.session_id,
                order_index: record.order_index + 1,
                started_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (nextRecord) {
            nextRecord.started_at = new Date();
            await this.recordRepository.save(nextRecord);
        }
        else {
            const session = await this.sessionRepository.findOne({
                where: {
                    session_id: record.session_id === null
                        ? undefined
                        : record.session_id,
                },
                relations: ['records'],
            });
            if (session) {
                const totalDuration = session.records.reduce((sum, r) => sum + (r.duration ?? 0), 0);
                session.status = 'COMPLETED';
                session.ended_at = new Date();
                session.total_duration = totalDuration;
                await this.sessionRepository.save(session);
            }
        }
        return record;
    }
    async pauseRecord(recordId) {
        const record = await this.recordRepository.findOne({
            where: { record_id: recordId },
        });
        if (!record) {
            throw new common_1.BadRequestException('운동 기록이 없습니다.');
        }
        if (!record.started_at) {
            throw new common_1.BadRequestException('진행 중인 운동이 아닙니다.');
        }
        if (record.ended_at) {
            throw new common_1.BadRequestException('이미 종료된 운동입니다.');
        }
        const now = new Date();
        const additional = Math.floor((now.getTime() - record.started_at.getTime()) / 1000);
        record.duration = (record.duration ?? 0) + additional;
        record.started_at = null;
        await this.recordRepository.save(record);
        return record;
    }
    async resumeRecord(recordId) {
        const record = await this.recordRepository.findOne({
            where: { record_id: recordId },
        });
        if (!record) {
            throw new common_1.BadRequestException('운동 기록이 없습니다.');
        }
        if (record.ended_at) {
            throw new common_1.BadRequestException('이미 종료된 운동입니다.');
        }
        if (record.started_at) {
            throw new common_1.BadRequestException('이미 진행 중입니다.');
        }
        if (record.session_id) {
            const session = await this.sessionRepository.findOne({
                where: { session_id: record.session_id },
            });
            if (!session || session.status !== 'ONGOING') {
                throw new common_1.BadRequestException('이미 종료된 세션입니다.');
            }
        }
        record.started_at = new Date();
        await this.recordRepository.save(record);
        return record;
    }
    async abortSession(sessionId) {
        const session = await this.sessionRepository.findOne({
            where: { session_id: sessionId },
            relations: ['records'],
        });
        if (!session) {
            throw new common_1.BadRequestException('세션이 존재하지 않습니다.');
        }
        const now = new Date();
        let totalDuration = 0;
        for (const record of session.records) {
            if (record.started_at && !record.ended_at) {
                record.ended_at = now;
                record.duration = Math.floor((now.getTime() - record.started_at.getTime()) / 1000);
            }
            if (!record.duration) {
                record.duration = 0;
            }
            totalDuration += record.duration;
            await this.recordRepository.save(record);
        }
        session.status = 'ABORTED';
        session.ended_at = now;
        session.total_duration = totalDuration;
        await this.sessionRepository.save(session);
        return session;
    }
    async getCurrentSession(userId) {
        const session = await this.sessionRepository.findOne({
            where: {
                user_id: userId,
                status: 'ONGOING',
            },
            relations: ['records'],
            order: { started_at: 'DESC' },
        });
        if (!session) {
            return {
                message: '현재 진행 중인 운동이 없습니다.',
            };
        }
        return {
            ...session,
            total_duration_formatted: this.formatDuration(session.total_duration ?? 0),
        };
    }
    async getHistory(userId) {
        const sessions = await this.sessionRepository.find({
            where: {
                user_id: userId,
                status: (0, typeorm_2.In)(['COMPLETED', 'ABORTED']),
            },
            relations: ['records'],
            order: { started_at: 'DESC' },
        });
        return {
            sessions: sessions.map((s) => ({
                ...s,
                total_duration_formatted: this.formatDuration(s.total_duration ?? 0),
            })),
        };
    }
    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [];
        if (h > 0) {
            parts.push(`${h}시간`);
        }
        if (m > 0) {
            parts.push(`${m}분`);
        }
        if (s > 0 || parts.length === 0) {
            parts.push(`${s}초`);
        }
        return parts.join(' ');
    }
};
exports.ExerciseService = ExerciseService;
exports.ExerciseService = ExerciseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_session_entity_1.ExerciseSession)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_record_entity_1.ExerciseRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        recommend_service_1.RecommendService])
], ExerciseService);
//# sourceMappingURL=exercise.service.js.map