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
exports.PregnancyWeightLog = void 0;
const typeorm_1 = require("typeorm");
const pregnancy_info_entity_1 = require("./pregnancy-info.entity");
let PregnancyWeightLog = class PregnancyWeightLog {
    weight_log_id;
    pregnancy_id;
    week;
    weight;
    pregnancy;
    created_at;
};
exports.PregnancyWeightLog = PregnancyWeightLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PregnancyWeightLog.prototype, "weight_log_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PregnancyWeightLog.prototype, "pregnancy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PregnancyWeightLog.prototype, "week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PregnancyWeightLog.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pregnancy_info_entity_1.PregnancyInfo, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pregnancy_id' }),
    __metadata("design:type", pregnancy_info_entity_1.PregnancyInfo)
], PregnancyWeightLog.prototype, "pregnancy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PregnancyWeightLog.prototype, "created_at", void 0);
exports.PregnancyWeightLog = PregnancyWeightLog = __decorate([
    (0, typeorm_1.Entity)('pregnancy_weight_log'),
    (0, typeorm_1.Unique)(['pregnancy_id', 'week'])
], PregnancyWeightLog);
//# sourceMappingURL=pregnancy-weight-log.entity.js.map