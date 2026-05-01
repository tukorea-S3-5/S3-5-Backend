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
exports.ExerciseResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExerciseResultDto {
    exercise_id;
    exercise_name;
    category_name;
    intensity;
    position_type;
    fall_risk;
    allowed_trimesters;
    description;
    difficulty_label;
    video_url;
}
exports.ExerciseResultDto = ExerciseResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ExerciseResultDto.prototype, "exercise_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '산책' }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "exercise_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '유산소' }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'low' }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "intensity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'standing' }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "position_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ExerciseResultDto.prototype, "fall_risk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2, 3] }),
    __metadata("design:type", Array)
], ExerciseResultDto.prototype, "allowed_trimesters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '임산부에게 적합한 저강도 유산소 운동입니다.',
    }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '쉬움' }),
    __metadata("design:type", String)
], ExerciseResultDto.prototype, "difficulty_label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/video.mp4',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ExerciseResultDto.prototype, "video_url", void 0);
//# sourceMappingURL=exercise-result.dto.js.map