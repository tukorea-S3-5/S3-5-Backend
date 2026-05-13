import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {

  private openai?: OpenAI;

  constructor() {
    // USE_LLM이 true일 때만 OpenAI 인스턴스 생성
    if (process.env.USE_LLM === 'true') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async generateExerciseComment(data: {
    week?: number;
    totalDuration: number;
    status: string;
    symptoms: string[];
    avgHeartRate: number;
    intensityLevel: string;
    trimesterNotice: string;
    exercises: { name: string; duration: number }[];
  }): Promise<string> {

    /**
     * 개발 단계에서는 LLM을 호출하지 않고 Mock 응답을 사용
     */
    if (process.env.USE_LLM !== 'true' || !this.openai) {
      return this.generateMockComment(data);
    }

    const exerciseSummary = data.exercises
      .map(e => `${e.name} ${Math.floor(e.duration / 60)}분`)
      .join(', ');

    const prompt = `
    임신 ${data.week ?? '알 수 없음'}주차 사용자입니다.
    오늘 수행한 운동: ${exerciseSummary}
    총 운동 시간: ${Math.floor(data.totalDuration / 60)}분
    평균 심박수: ${Math.round(data.avgHeartRate)}
    강도 수준: ${data.intensityLevel}
    현재 증상: ${data.symptoms.join(', ') || '없음'}

    참고 주의사항:
    ${data.trimesterNotice}

    위 정보를 바탕으로
    1. 격려 메시지
    2. 주의사항
    3. 다음 운동 제안
    을 3~4줄로 작성하세요.
    의료적 진단처럼 말하지 말고 조언 형태로 작성하세요.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content ?? '';
  }
  // 조사 자동 처리 함수
  private attachObjectParticle(word: string): string {
    if (!word) return word;

    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0);

    // 한글 범위 체크
    if (code >= 0xac00 && code <= 0xd7a3) {
      const hasBatchim = (code - 0xac00) % 28 !== 0;
      return hasBatchim ? `${word}을` : `${word}를`;
    }

    return `${word}을`;
  }

  // 운동 시간 포맷팅 (예: 1시간 30분 45초)
  private formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts: string[] = [];

    if (h > 0) {
      parts.push(`${h}시간`);
    }

    if (m > 0) {
      parts.push(`${m}분`);
    }

    if (s > 0 || parts.length === 0) {
      parts.push(`${s}초`);
    }

    return parts.join(' ');
  }

  /**
   * Mock 모드용 리포트 생성
   */
  private generateMockComment(data: {
    week?: number;
    totalDuration: number;
    status: string;
    symptoms: string[];
    avgHeartRate: number;
    intensityLevel: string;
    trimesterNotice: string;
    exercises: { name: string; duration: number }[];
  }): string {

    const formattedDuration = this.formatDuration(data.totalDuration);
    const exerciseNamesRaw = data.exercises.map(e => e.name).join(', ');
    const exerciseNames = this.attachObjectParticle(exerciseNamesRaw);

    let message = '';

    // 세션 상태 반영
    if (data.status === 'ABORTED') {
      message += `오늘 운동은 중간에 종료되었습니다. `;
    } else {
      message += `오늘 ${exerciseNames} ${formattedDuration} 동안 잘 수행하셨습니다. `;
    }

    // 강도 분석
    if (data.intensityLevel === 'HIGH') {
      message += `평균 심박수 ${data.avgHeartRate}bpm으로 비교적 높은 강도의 운동이었습니다. `;
      message += `무리하지 않도록 다음 운동 전 충분한 휴식을 권장합니다. `;
    } else if (data.intensityLevel === 'MEDIUM') {
      message += `적절한 강도로 안정적인 운동을 하셨습니다. `;
    } else {
      message += `부담이 적은 강도로 컨디션을 잘 유지하셨습니다. `;
    }

    // 증상 반영
    if (data.symptoms?.length > 0) {
      message += `현재 증상(${data.symptoms.join(', ')})을 고려해 무리하지 않는 것이 중요합니다. `;
    }

    // 분기 반영
    if (data.week) {
      if (data.week <= 13) {
        message += `임신 초기에는 특히 피로 관리가 중요합니다. `;
      } else if (data.week <= 27) {
        message += `중기에는 복부 압박 동작을 피하는 것이 좋습니다. `;
      } else {
        message += `후기에는 균형 유지에 각별히 주의하세요. `;
      }
    }

    // 마무리 코멘트
    message += `꾸준함이 가장 큰 자산입니다. 오늘도 잘 해내셨습니다.`;

    return message;
  }

  // 임산부 건강 리포트
  async generateHealthReport(data: {
    week: number;
    bmi: number;
    weightStatus: string;
  }): Promise<string> {

    if (process.env.USE_LLM !== 'true' || !this.openai) {
      return this.generateMockHealthReport(data);
    }

    const prompt = `
    임신 ${data.week}주차 사용자입니다.
    BMI는 ${data.bmi}이며 체중 상태는 ${data.weightStatus}입니다.

    1. 현재 시기에 맞는 건강 관리 조언
    2. 체중 관리 관련 조언
    3. 주의사항

    을 3~4줄로 작성하세요.
    의료적 진단처럼 말하지 말고 조언 형태로 작성하세요.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content ?? '';
  }

  private generateMockHealthReport(data: {
    week: number;
    bmi: number;
    weightStatus: string;
  }): string {

    let message = `임신 ${data.week}주차입니다. `;

    if (data.week <= 13) {
      message += '초기에는 충분한 휴식과 영양 관리가 중요합니다. ';
    } else if (data.week <= 27) {
      message += '중기에는 체중 증가를 안정적으로 관리하는 것이 좋습니다. ';
    } else {
      message += '후기에는 낙상 예방과 무리한 활동을 피하는 것이 중요합니다. ';
    }

    if (data.bmi >= 25) {
      message += '체중 증가 속도를 천천히 조절하는 것이 좋겠습니다. ';
    } else {
      message += '현재 체중 상태는 비교적 안정적입니다. ';
    }

    message += '균형 잡힌 식사와 가벼운 운동을 꾸준히 유지하세요.';

    return message;
  }
}