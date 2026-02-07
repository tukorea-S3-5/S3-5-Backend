"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseTypeRule = exerciseTypeRule;
function exerciseTypeRule(exerciseType) {
    const blockedExercises = ['점프', '복근운동', '고강도 인터벌'];
    if (blockedExercises.includes(exerciseType)) {
        return {
            decision: 'BLOCK',
            reason: '해당 운동은 임신 중 위험할 수 있습니다.',
        };
    }
    return null;
}
//# sourceMappingURL=exercise-type.rule.js.map