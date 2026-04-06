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
exports.CreateHealthReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateHealthReportDto {
    week;
    bmi;
    weightStatus;
}
exports.CreateHealthReportDto = CreateHealthReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 16,
        description: '임신 주차',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHealthReportDto.prototype, "week", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 22.5,
        description: 'BMI 수치',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHealthReportDto.prototype, "bmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '정상',
        description: '체중 상태',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHealthReportDto.prototype, "weightStatus", void 0);
//# sourceMappingURL=create-health-report.dto.js.map