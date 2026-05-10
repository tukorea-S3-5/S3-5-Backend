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
exports.ExerciseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const exercise_service_1 = require("./exercise.service");
const end_exercise_record_dto_1 = require("./dto/end-exercise-record.dto");
let ExerciseController = class ExerciseController {
    exerciseService;
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    startSession(req, body) {
        return this.exerciseService.startRecommendedSession(req.user.user_id, body?.type ?? 'recommend');
    }
    startSelectedRecords(req, body) {
        return this.exerciseService.startSelectedRecords(req.user.user_id, body.exercise_ids);
    }
    endRecord(dto) {
        return this.exerciseService.endRecord(dto.record_id, dto.heart_rates);
    }
    pauseRecord(body) {
        return this.exerciseService.pauseRecord(body.record_id);
    }
    resumeRecord(body) {
        return this.exerciseService.startOrResumeRecord(body.record_id);
    }
    abortSession(body) {
        return this.exerciseService.abortSession(body.session_id, body.heart_rates);
    }
    getHistory(req) {
        return this.exerciseService.getHistory(req.user.user_id);
    }
    getCurrentSession(req) {
        return this.exerciseService.getCurrentSession(req.user.user_id);
    }
};
exports.ExerciseController = ExerciseController;
__decorate([
    (0, common_1.Post)('session/start'),
    (0, swagger_1.ApiOperation)({ summary: '전체 운동 시작' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['recommend', 'caution'],
                    example: 'recommend',
                    description: 'recommend: 추천 운동 전체 시작, caution: 주의 운동 전체 시작',
                },
            },
        },
        required: false,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('record/start'),
    (0, swagger_1.ApiOperation)({ summary: '개별 운동 시작 (여러 개 선택)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                exercise_ids: {
                    type: 'array',
                    items: { type: 'number' },
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "startSelectedRecords", null);
__decorate([
    (0, common_1.Post)('record/end'),
    (0, swagger_1.ApiOperation)({ summary: '운동 종료 (하나씩)' }),
    (0, swagger_1.ApiBody)({ type: end_exercise_record_dto_1.EndExerciseRecordDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [end_exercise_record_dto_1.EndExerciseRecordDto]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "endRecord", null);
__decorate([
    (0, common_1.Post)('record/pause'),
    (0, swagger_1.ApiOperation)({ summary: '운동 일시정지' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                record_id: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "pauseRecord", null);
__decorate([
    (0, common_1.Post)('record/resume'),
    (0, swagger_1.ApiOperation)({ summary: '운동 시작 및 재개' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                record_id: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "resumeRecord", null);
__decorate([
    (0, common_1.Post)('session/abort'),
    (0, swagger_1.ApiOperation)({ summary: '운동 세션 중단' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                session_id: { type: 'number' },
                heart_rates: {
                    type: 'array',
                    items: { type: 'number' },
                    example: [82, 85, 88, 90, 87],
                },
            },
            required: ['session_id'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "abortSession", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: '운동 기록 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('session/current'),
    (0, swagger_1.ApiOperation)({ summary: '현재 진행 중 세션 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getCurrentSession", null);
exports.ExerciseController = ExerciseController = __decorate([
    (0, swagger_1.ApiTags)('Exercise'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('exercise'),
    __metadata("design:paramtypes", [exercise_service_1.ExerciseService])
], ExerciseController);
//# sourceMappingURL=exercise.controller.js.map