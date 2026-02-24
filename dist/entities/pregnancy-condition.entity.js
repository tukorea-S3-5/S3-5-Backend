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
exports.PregnancyCondition = void 0;
const typeorm_1 = require("typeorm");
const pregnancy_info_entity_1 = require("./pregnancy-info.entity");
const condition_enum_1 = require("../common/enums/condition.enum");
let PregnancyCondition = class PregnancyCondition {
    id;
    pregnancy_id;
    condition_code;
    pregnancy;
};
exports.PregnancyCondition = PregnancyCondition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PregnancyCondition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PregnancyCondition.prototype, "pregnancy_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: condition_enum_1.ConditionType,
    }),
    __metadata("design:type", String)
], PregnancyCondition.prototype, "condition_code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pregnancy_info_entity_1.PregnancyInfo, pregnancy => pregnancy.conditions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pregnancy_id' }),
    __metadata("design:type", pregnancy_info_entity_1.PregnancyInfo)
], PregnancyCondition.prototype, "pregnancy", void 0);
exports.PregnancyCondition = PregnancyCondition = __decorate([
    (0, typeorm_1.Entity)('pregnancy_condition')
], PregnancyCondition);
//# sourceMappingURL=pregnancy-condition.entity.js.map