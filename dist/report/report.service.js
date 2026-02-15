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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_session_entity_1 = require("../entities/exercise-session.entity");
const exercise_record_entity_1 = require("../entities/exercise-record.entity");
let ReportService = class ReportService {
    sessionRepository;
    recordRepository;
    constructor(sessionRepository, recordRepository) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
    }
    async generateSessionReport(userId, sessionId) {
        const session = await this.sessionRepository.findOne({
            where: {
                session_id: sessionId,
                user_id: userId,
                status: 'COMPLETED',
            },
        });
        if (!session) {
            throw new common_1.BadRequestException('해당 세션이 존재하지 않습니다.');
        }
        const records = await this.recordRepository.find({
            where: { session_id: sessionId },
        });
        const totalDuration = records.reduce((sum, record) => sum + (record.duration ?? 0), 0);
        const exerciseSummary = records.map((record) => ({
            exercise_name: record.exercise_name,
            duration: record.duration,
            avg_heart_rate: null,
            max_heart_rate: null,
        }));
        return {
            total_duration: totalDuration,
            avg_heart_rate: null,
            max_heart_rate: null,
            exercises: exerciseSummary,
        };
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_session_entity_1.ExerciseSession)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_record_entity_1.ExerciseRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportService);
//# sourceMappingURL=report.service.js.map