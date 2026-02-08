"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleService = void 0;
const common_1 = require("@nestjs/common");
let RuleService = class RuleService {
    evaluateExercise(params) {
        if (params.week <= 12 && params.exerciseType === 'HIIT') {
            return {
                decision: 'BLOCK',
                reason: '임신 초기에는 고강도 운동이 제한됩니다.',
            };
        }
        if (params.isMultiple === true) {
            return {
                decision: 'LIMIT',
                reason: '다태아 임신의 경우 운동 강도를 낮추는 것이 권장됩니다.',
            };
        }
        return {
            decision: 'ALLOW',
            reason: '운동 가능합니다.',
        };
    }
};
exports.RuleService = RuleService;
exports.RuleService = RuleService = __decorate([
    (0, common_1.Injectable)()
], RuleService);
//# sourceMappingURL=rule.service.js.map