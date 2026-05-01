import { SymptomType } from '../../common/enums/symptom.enum';
import { EffectType } from '../../entities/exercise-tag-map.entity';

export const exerciseTagSeed = [

  // 케겔
  {
    exercise_id: 5,
    symptom_name: SymptomType.PELVIC_PAIN,
    effect_type: EffectType.POSITIVE_STRONG,
  },
  {
    exercise_id: 5,
    symptom_name: SymptomType.BACK_PAIN,
    effect_type: EffectType.POSITIVE_WEAK,
  },

  // 힐 레이즈
  {
    exercise_id: 6,
    symptom_name: SymptomType.SWELLING,
    effect_type: EffectType.POSITIVE_STRONG,
  },

  // 전신 스트레칭
  {
    exercise_id: 2,
    symptom_name: SymptomType.BACK_PAIN,
    effect_type: EffectType.POSITIVE_WEAK,
  },
  {
    exercise_id: 2,
    symptom_name: SymptomType.CONSTIPATION,
    effect_type: EffectType.POSITIVE_WEAK,
  },

  // 의자 스쿼트
  {
    exercise_id: 7,
    symptom_name: SymptomType.PELVIC_PAIN,
    effect_type: EffectType.NEGATIVE,
  },
  {
    exercise_id: 7,
    symptom_name: SymptomType.SHORTNESS_OF_BREATH,
    effect_type: EffectType.NEGATIVE,
  },
];