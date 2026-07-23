import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(() => {
    process.env.USE_LLM = 'false';
    service = new AiService();
  });

  afterEach(() => {
    delete process.env.USE_LLM;
  });

  it('should omit exercise name from mock recommendation comments', async () => {
    const comment = await service.generateRecommendationComment({
      type: 'caution',
      week: 20,
      trimester: 2,
      bmi: 22,
      symptoms: ['BACK_PAIN'],
      conditions: [],
      exercise: {
        name: '걷기',
        category: '유산소',
        intensity: 'LOW',
        positionType: 'STANDING',
        fallRisk: false,
        description: '임산부에게 가장 안전한 기본 유산소 운동',
      },
      ruleReasons: [
        '안전 필터는 통과했지만 최신 증상과 직접적인 긍정 태그가 없어 주의 운동으로 분류',
      ],
    });

    expect(comment).toBe(
      '수행 가능하지만 강도와 시간을 낮춰 진행하는 것이 좋습니다. 근거: 안전 필터는 통과했지만 최신 증상과 직접적인 긍정 태그가 없어 주의 운동으로 분류.',
    );
    expect(comment).not.toContain('걷기은');
    expect(comment).not.toContain('걷기는');
  });

  it('should reassure early pregnancy users in mock health report', async () => {
    const report = await service.generateHealthReport({
      week: 8,
      bmi: 21,
      weightStatus: '정상',
    });

    expect(report).toContain('입덧과 식욕 저하');
    expect(report).toContain('체중이 줄거나 늘지 않아도 자연스러운 경우');
  });
});
