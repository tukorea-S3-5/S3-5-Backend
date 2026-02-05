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
const exercise_service_1 = require("./exercise.service");
const start_exercise_dto_1 = require("./dto/start-exercise.dto");
const end_exercise_dto_1 = require("./dto/end-exercise.dto");
const common_2 = require("@nestjs/common");
let ExerciseController = class ExerciseController {
    exerciseService;
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    startExercise(dto) {
        return this.exerciseService.startExercise(dto);
    }
    endExercise(dto) {
        return this.exerciseService.endExercise(dto);
    }
    getUserSessions(userId) {
        return this.exerciseService.getSessionsByUser(userId);
    }
};
exports.ExerciseController = ExerciseController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: '운동 시작' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_exercise_dto_1.StartExerciseDto]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "startExercise", null);
__decorate([
    (0, common_1.Post)('end'),
    (0, swagger_1.ApiOperation)({ summary: '운동 종료' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [end_exercise_dto_1.EndExerciseDto]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "endExercise", null);
__decorate([
    (0, common_2.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: '사용자 운동 기록 조회' }),
    __param(0, (0, common_2.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExerciseController.prototype, "getUserSessions", null);
exports.ExerciseController = ExerciseController = __decorate([
    (0, swagger_1.ApiTags)('Exercise'),
    (0, common_1.Controller)('exercise'),
    __metadata("design:paramtypes", [exercise_service_1.ExerciseService])
], ExerciseController);
//# sourceMappingURL=exercise.controller.js.map