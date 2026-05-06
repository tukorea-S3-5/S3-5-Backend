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
exports.SessionReportResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const session_exercise_dto_1 = require("./session-exercise.dto");
class SessionReportResponseDto {
    total_duration;
    avg_heart_rate;
    max_heart_rate;
    status;
    exercises;
}
exports.SessionReportResponseDto = SessionReportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SessionReportResponseDto.prototype, "total_duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], SessionReportResponseDto.prototype, "avg_heart_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], SessionReportResponseDto.prototype, "max_heart_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'COMPLETED',
        description: '세션 상태 (COMPLETED | ABORTED)',
    }),
    __metadata("design:type", String)
], SessionReportResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [session_exercise_dto_1.SessionExerciseDto] }),
    __metadata("design:type", Array)
], SessionReportResponseDto.prototype, "exercises", void 0);
//# sourceMappingURL=session-report-response.dto.js.map