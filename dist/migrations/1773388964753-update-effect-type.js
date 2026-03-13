"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEffectType1773388964753 = void 0;
class UpdateEffectType1773388964753 {
    name = 'UpdateEffectType1773388964753';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` CHANGE \`effect_type\` \`effect_type\` enum ('POSITIVE_STRONG', 'POSITIVE_WEAK', 'NEGATIVE') NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` CHANGE \`effect_type\` \`effect_type\` enum ('POSITIVE', 'NEGATIVE') NOT NULL`);
    }
}
exports.UpdateEffectType1773388964753 = UpdateEffectType1773388964753;
//# sourceMappingURL=1773388964753-update-effect-type.js.map