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
const start_exercise_record_dto_1 = require("./dto/start-exercise-record.dto");
const end_exercise_record_dto_1 = require("./dto/end-exercise-record.dto");
let ExerciseController = class ExerciseController {
    exerciseService;
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    startSession(req) {
        return this.exerciseService.startSession(req.user.user_id);
    }
    endSession(req) {
        return this.exerciseService.endSession(req.user.user_id);
    }
    startRecord(req, dto) {
        return this.exerciseService.startRecord(req.user.user_id, dto.exercise_name, dto.order_index);
    }
    endRecord(dto) {
        return this.exerciseService.endRecord(dto.record_id);
    }
    getHistory(req) {
        return this.exerciseService.getHistory(req.user.user_id);
    }
    getAllExercises() {
        return this.exerciseService.getAllExercises();
    }
    getExerciseDetail(id) {
        return this.exerciseService.getExerciseDetail(Number(id));
    }
};
exports.ExerciseController = ExerciseController;
__decorate([
    (0, common_1.Post)('session/start'),
    (0, swagger_1.ApiOperation)({ summary: '전체 운동 시작' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('session/end'),
    (0, swagger_1.ApiOperation)({ summary: '전체 운동 종료' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "endSession", null);
__decorate([
    (0, common_1.Post)('record/start'),
    (0, swagger_1.ApiOperation)({ summary: '개별 운동 시작' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, start_exercise_record_dto_1.StartExerciseRecordDto]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "startRecord", null);
__decorate([
    (0, common_1.Post)('record/end'),
    (0, swagger_1.ApiOperation)({ summary: '개별 운동 종료' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [end_exercise_record_dto_1.EndExerciseRecordDto]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "endRecord", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: '운동 기록 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '운동 목록 조회' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getAllExercises", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '운동 상세 조회' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getExerciseDetail", null);
exports.ExerciseController = ExerciseController = __decorate([
    (0, swagger_1.ApiTags)('Exercise'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('exercise'),
    __metadata("design:paramtypes", [exercise_service_1.ExerciseService])
], ExerciseController);
//# sourceMappingURL=exercise.controller.js.map