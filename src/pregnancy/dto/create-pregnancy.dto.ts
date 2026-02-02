/**
 * 임신 정보 등록 요청 DTO
 * 프론트엔드에서 전달받는 데이터 구조
 */
export class CreatePregnancyDto {
    user_id: string;
  
    height: number;
    pre_weight: number;
    current_weight: number;
  
    pregnancy_start_date: string;
    due_date?: string;
  }
  