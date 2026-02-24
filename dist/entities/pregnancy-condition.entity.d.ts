import { PregnancyInfo } from './pregnancy-info.entity';
import { ConditionType } from 'src/common/enums/condition.enum';
export declare class PregnancyCondition {
    id: number;
    pregnancy_id: number;
    condition_code: ConditionType;
    pregnancy: PregnancyInfo;
}
