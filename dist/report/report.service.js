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
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const symptom_log_entity_1 = require("../entities/symptom-log.entity");
const ai_service_1 = require("../ai/ai.service");
let ReportService = class ReportService {
    sessionRepository;
    recordRepository;
    pregnancyRepository;
    symptomRepository;
    aiService;
    constructor(sessionRepository, recordRepository, pregnancyRepository, symptomRepository, aiService) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.symptomRepository = symptomRepository;
        this.aiService = aiService;
    }
    calculateWeek(lmpInput) {
        const lmp = lmpInput instanceof Date ? lmpInput : new Date(lmpInput);
        const today = new Date();
        const diffDays = (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24);
        const week = Math.floor(diffDays / 7);
        return week < 0 ? 0 : week;
    }
    calculateTrimester(week) {
        if (week <= 13)
            return 1;
        if (week <= 27)
            return 2;
        return 3;
    }
    getTrimesterNotice(trimester) {
        if (trimester === 1) {
            return '임신 초기에는 피로, 어지러움, 출혈 징후가 있으면 즉시 운동을 중단하고 저강도 운동 위주로 진행합니다.';
        }
        if (trimester === 2) {
            return '임신 중기에는 복부 압박과 바로 누운 자세를 피하고 균형이 불안정한 동작은 주의합니다.';
        }
        if (trimester === 3) {
            return '임신 후기에는 낙상 위험과 과도한 심박 상승을 피하고 운동 강도와 시간을 낮춥니다.';
        }
        return '임신 정보가 부족하므로 무리하지 않는 저강도 운동을 우선합니다.';
    }
    buildReportRuleReasons(params) {
        const reasons = [];
        if (params.trimester === 2) {
            reasons.push('2분기 기준 복부 압박과 바로 누운 자세를 주의');
        }
        if (params.trimester === 3) {
            reasons.push('3분기 기준 낙상 위험과 과도한 운동 강도를 주의');
        }
        if (params.avgHeartRate &&
            params.maxAllowedBpm &&
            params.avgHeartRate >= params.maxAllowedBpm) {
            reasons.push('평균 심박수가 사용자 최대 허용 심박수에 근접');
        }
        if (params.symptoms.length) {
            reasons.push(`최근 증상(${params.symptoms.join(', ')}) 반영`);
        }
        if (params.conditions.length) {
            reasons.push(`기저 질환/주의 조건(${params.conditions.join(', ')}) 반영`);
        }
        return reasons;
    }
    async generateSessionReport(userId, sessionId) {
        const session = await this.sessionRepository.findOne({
            where: {
                session_id: sessionId,
                user_id: userId,
                status: (0, typeorm_2.In)(['COMPLETED', 'ABORTED']),
            },
        });
        if (!session) {
            throw new common_1.BadRequestException('해당 세션이 존재하지 않습니다.');
        }
        const records = await this.recordRepository.find({
            where: { session_id: sessionId },
        });
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
            relations: ['conditions'],
        });
        const latestSymptom = await this.symptomRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        const week = pregnancy
            ? this.calculateWeek(pregnancy.last_menstrual_period)
            : undefined;
        const trimester = week !== undefined ? this.calculateTrimester(week) : undefined;
        const symptoms = latestSymptom?.symptoms ?? [];
        const conditions = pregnancy?.conditions?.map((condition) => condition.condition_code) ?? [];
        const totalDuration = records.reduce((sum, record) => sum + (record.duration ?? 0), 0);
        const validRecords = records.filter((record) => record.avg_heart_rate !== null && record.max_heart_rate !== null);
        const sessionAvgHeartRate = validRecords.length
            ? Math.round(validRecords.reduce((sum, r) => sum + r.avg_heart_rate, 0) /
                validRecords.length)
            : null;
        const sessionMaxHeartRate = validRecords.length
            ? Math.max(...validRecords.map((r) => r.max_heart_rate))
            : null;
        const exerciseSummary = records.map((record) => ({
            exercise_name: record.exercise_name,
            duration: record.duration ?? null,
            avg_heart_rate: record.avg_heart_rate ?? null,
            max_heart_rate: record.max_heart_rate ?? null,
        }));
        const intensityLevel = sessionAvgHeartRate && sessionAvgHeartRate > 140
            ? 'HIGH'
            : sessionAvgHeartRate && sessionAvgHeartRate > 110
                ? 'MEDIUM'
                : 'LOW';
        const ruleReasons = this.buildReportRuleReasons({
            trimester,
            avgHeartRate: sessionAvgHeartRate,
            maxAllowedBpm: pregnancy?.max_allowed_bpm ?? null,
            symptoms,
            conditions,
        });
        const aiComment = await this.aiService.generateExerciseComment({
            week,
            trimester,
            bmi: pregnancy?.bmi ?? null,
            maxAllowedBpm: pregnancy?.max_allowed_bpm ?? null,
            conditions,
            totalDuration,
            status: session.status,
            symptoms,
            avgHeartRate: sessionAvgHeartRate ?? 0,
            intensityLevel,
            trimesterNotice: this.getTrimesterNotice(trimester),
            ruleReasons,
            exercises: records.map((r) => ({
                name: r.exercise_name,
                duration: r.duration ?? 0,
            })),
        });
        return {
            total_duration: totalDuration,
            avg_heart_rate: sessionAvgHeartRate,
            max_heart_rate: sessionMaxHeartRate,
            status: session.status,
            exercises: exerciseSummary,
            ai_comment: aiComment,
        };
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_session_entity_1.ExerciseSession)),
    __param(1, (0, typeorm_1.InjectRepository)(exercise_record_entity_1.ExerciseRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __param(3, (0, typeorm_1.InjectRepository)(symptom_log_entity_1.SymptomLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService])
], ReportService);
//# sourceMappingURL=report.service.js.map