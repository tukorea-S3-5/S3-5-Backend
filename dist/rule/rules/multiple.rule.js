"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplePregnancyRule = multiplePregnancyRule;
function multiplePregnancyRule(pregnancy) {
    if (pregnancy.is_multiple === true) {
        return {
            decision: 'LIMIT',
            reason: '다태아 임신은 저강도 운동만 허용됩니다.',
        };
    }
    return null;
}
//# sourceMappingURL=multiple.rule.js.map