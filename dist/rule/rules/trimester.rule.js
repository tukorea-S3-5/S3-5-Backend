"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimesterRule = trimesterRule;
function calculateWeek(lmp) {
    const today = new Date();
    const diffDays = (today.getTime() - lmp.getTime()) /
        (1000 * 60 * 60 * 24);
    return Math.floor(diffDays / 7);
}
function calculateTrimester(lmp) {
    const week = calculateWeek(lmp);
    return Math.ceil(week / 13);
}
function trimesterRule(pregnancy) {
    const trimester = calculateTrimester(pregnancy.last_menstrual_period);
    if (trimester === 1) {
        return {
            decision: 'LIMIT',
            reason: '임신 1기에는 저강도 운동만 권장됩니다.',
        };
    }
    if (trimester === 3) {
        return {
            decision: 'LIMIT',
            reason: '임신 후기에는 균형을 요구하는 운동을 피해야 합니다.',
        };
    }
    return null;
}
//# sourceMappingURL=trimester.rule.js.map