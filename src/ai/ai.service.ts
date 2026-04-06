import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  /**
   * 임산부 건강 리포트 생성 (Mock)
   * 추후 OpenAI API 연동 예정
   */
  async generateHealthReport(data: any): Promise<string> {
    const { week, bmi, weightStatus } = data;

    return `
MomFit AI 건강 리포트

현재 임신 ${week}주차입니다.
BMI는 ${bmi}이며 체중 상태는 '${weightStatus}'입니다.

균형 잡힌 식단과 가벼운 운동을 유지하세요.
무리한 활동은 피하고 충분한 휴식을 취하는 것이 좋습니다.
    `.trim();
  }
}