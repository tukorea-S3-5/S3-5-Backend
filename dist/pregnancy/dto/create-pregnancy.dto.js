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
exports.CreatePregnancyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePregnancyDto {
    last_menstrual_period;
    height;
    pre_weight;
    is_multiple;
    fitness_level;
    contraindication;
}
exports.CreatePregnancyDto = CreatePregnancyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-11-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "last_menstrual_period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 160 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePregnancyDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 55 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePregnancyDto.prototype, "pre_weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePregnancyDto.prototype, "is_multiple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ACTIVE',
        description: '임신 전 운동 여부 (ACTIVE 또는 SEDENTARY)',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "fitness_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: '상대적 금기사항 유무' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePregnancyDto.prototype, "contraindication", void 0);
//# sourceMappingURL=create-pregnancy.dto.js.map