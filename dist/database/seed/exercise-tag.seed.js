"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseTagSeed = void 0;
const symptom_enum_1 = require("../../common/enums/symptom.enum");
const exercise_tag_map_entity_1 = require("../../entities/exercise-tag-map.entity");
exports.exerciseTagSeed = [
    {
        exercise_id: 5,
        symptom_name: symptom_enum_1.SymptomType.PELVIC_PAIN,
        effect_type: exercise_tag_map_entity_1.EffectType.POSITIVE_STRONG,
    },
    {
        exercise_id: 5,
        symptom_name: symptom_enum_1.SymptomType.BACK_PAIN,
        effect_type: exercise_tag_map_entity_1.EffectType.POSITIVE_WEAK,
    },
    {
        exercise_id: 6,
        symptom_name: symptom_enum_1.SymptomType.SWELLING,
        effect_type: exercise_tag_map_entity_1.EffectType.POSITIVE_STRONG,
    },
    {
        exercise_id: 2,
        symptom_name: symptom_enum_1.SymptomType.BACK_PAIN,
        effect_type: exercise_tag_map_entity_1.EffectType.POSITIVE_WEAK,
    },
    {
        exercise_id: 2,
        symptom_name: symptom_enum_1.SymptomType.CONSTIPATION,
        effect_type: exercise_tag_map_entity_1.EffectType.POSITIVE_WEAK,
    },
    {
        exercise_id: 7,
        symptom_name: symptom_enum_1.SymptomType.PELVIC_PAIN,
        effect_type: exercise_tag_map_entity_1.EffectType.NEGATIVE,
    },
    {
        exercise_id: 7,
        symptom_name: symptom_enum_1.SymptomType.SHORTNESS_OF_BREATH,
        effect_type: exercise_tag_map_entity_1.EffectType.NEGATIVE,
    },
];
//# sourceMappingURL=exercise-tag.seed.js.map