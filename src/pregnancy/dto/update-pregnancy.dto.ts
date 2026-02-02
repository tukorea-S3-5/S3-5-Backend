/**
 * 임신 정보 수정 DTO
 * 선택적으로 값이 들어오며, 들어온 값만 수정한다.
 */
export class UpdatePregnancyDto {
    /**
     * 현재 체중
     */
    current_weight?: number;
  
    /**
     * 출산 예정일
     */
    due_date?: string;
  }
  