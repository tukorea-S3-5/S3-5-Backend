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
exports.PregnancyInfo = void 0;
const typeorm_1 = require("typeorm");
let PregnancyInfo = class PregnancyInfo {
    pregnancy_id;
    user_id;
    trimester;
    week;
    height;
    pre_weight;
    current_weight;
    bmi;
    pregnancy_start_date;
    due_date;
    updated_at;
};
exports.PregnancyInfo = PregnancyInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "pregnancy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PregnancyInfo.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "trimester", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "pre_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "current_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], PregnancyInfo.prototype, "bmi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PregnancyInfo.prototype, "pregnancy_start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PregnancyInfo.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PregnancyInfo.prototype, "updated_at", void 0);
exports.PregnancyInfo = PregnancyInfo = __decorate([
    (0, typeorm_1.Entity)('pregnancy_info')
], PregnancyInfo);
//# sourceMappingURL=pregnancy-info.entity.js.map