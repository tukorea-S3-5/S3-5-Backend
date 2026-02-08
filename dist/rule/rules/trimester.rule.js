"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimesterRule = trimesterRule;
function trimesterRule(pregnancy) {
    if (pregnancy.trimester === 1) {
        return {
            decision: 'LIMIT',
            reason: '임신 1기에는 저강도 운동만 권장됩니다.',
        };
    }
    if (pregnancy.trimester === 3) {
        return {
            decision: 'LIMIT',
            reason: '임신 후기에는 균형을 요구하는 운동을 피해야 합니다.',
        };
    }
    return null;
}
//# sourceMappingURL=trimester.rule.js.map