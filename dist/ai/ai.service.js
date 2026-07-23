"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const openai_1 = __importDefault(require("openai"));
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    openai;
    constructor() {
        if (process.env.USE_LLM === 'true') {
            this.openai = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
    }
    isLlmEnabled() {
        return process.env.USE_LLM === 'true' && !!this.openai;
    }
    async generateExerciseComment(data) {
        if (!this.isLlmEnabled()) {
            return this.generateMockComment(data);
        }
        const exerciseSummary = data.exercises
            .map((e) => `${e.name} ${Math.floor(e.duration / 60)}분`)
            .join(', ');
        const prompt = `
    임신 ${data.week ?? '알 수 없음'}주차 사용자입니다.
    임신 분기: ${data.trimester ?? '알 수 없음'}분기
    BMI: ${data.bmi ?? '알 수 없음'}
    최대 허용 심박수: ${data.maxAllowedBpm ?? '알 수 없음'}bpm
    기저 질환/주의 조건: ${data.conditions?.join(', ') || '없음'}
    오늘 수행한 운동: ${exerciseSummary}
    총 운동 시간: ${Math.floor(data.totalDuration / 60)}분
    평균 심박수: ${Math.round(data.avgHeartRate)}
    강도 수준: ${data.intensityLevel}
    현재 증상: ${data.symptoms.join(', ') || '없음'}
    서버 Rule Engine 판단 근거: ${data.ruleReasons?.join(' / ') || '특이 제한 없음'}

    참고 주의사항:
    ${data.trimesterNotice}

    위 정보를 바탕으로
    1. 격려 메시지
    2. 주의사항
    3. 다음 운동 제안
    을 3~4줄로 작성하세요.
    의료적 진단처럼 말하지 말고 조언 형태로 작성하세요.
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You write safe Korean wellness guidance for pregnant users. Never diagnose. Always defer risky symptoms to medical professionals.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.4,
            });
            return (response.choices[0].message.content ?? this.generateMockComment(data));
        }
        catch {
            return this.generateMockComment(data);
        }
    }
    attachObjectParticle(word) {
        if (!word)
            return word;
        const lastChar = word[word.length - 1];
        const code = lastChar.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
            const hasBatchim = (code - 0xac00) % 28 !== 0;
            return hasBatchim ? `${word}을` : `${word}를`;
        }
        return `${word}을`;
    }
    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [];
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
    generateMockComment(data) {
        const formattedDuration = this.formatDuration(data.totalDuration);
        const exerciseNamesRaw = data.exercises.map((e) => e.name).join(', ');
        const exerciseNames = this.attachObjectParticle(exerciseNamesRaw);
        let message = '';
        if (data.status === 'ABORTED') {
            message += `오늘 운동은 중간에 종료되었습니다. `;
        }
        else {
            message += `오늘 ${exerciseNames} ${formattedDuration} 동안 잘 수행하셨습니다. `;
        }
        if (data.intensityLevel === 'HIGH') {
            message += `평균 심박수 ${data.avgHeartRate}bpm으로 비교적 높은 강도의 운동이었습니다. `;
            message += `무리하지 않도록 다음 운동 전 충분한 휴식을 권장합니다. `;
        }
        else if (data.intensityLevel === 'MEDIUM') {
            message += `적절한 강도로 안정적인 운동을 하셨습니다. `;
        }
        else {
            message += `부담이 적은 강도로 컨디션을 잘 유지하셨습니다. `;
        }
        if (data.symptoms?.length > 0) {
            message += `현재 증상(${data.symptoms.join(', ')})을 고려해 무리하지 않는 것이 중요합니다. `;
        }
        if (data.ruleReasons?.length) {
            message += `서버 안전 기준상 ${data.ruleReasons.join(', ')} 점을 함께 고려했습니다. `;
        }
        if (data.week) {
            if (data.week <= 13) {
                message += `임신 초기에는 특히 피로 관리가 중요합니다. `;
            }
            else if (data.week <= 27) {
                message += `중기에는 복부 압박 동작을 피하는 것이 좋습니다. `;
            }
            else {
                message += `후기에는 균형 유지에 각별히 주의하세요. `;
            }
        }
        message += `꾸준함이 가장 큰 자산입니다. 오늘도 잘 해내셨습니다.`;
        return message;
    }
    async generateRecommendationComment(data) {
        if (!this.isLlmEnabled()) {
            return this.generateMockRecommendationComment(data);
        }
        const earlyPregnancyGuardrail = data.week !== undefined && data.week <= 13
            ? '주의: 임신 초기(1~13주)이므로 입덧과 식욕 저하로 인해 체중이 줄거나 늘지 않아도 자연스러운 현상임을 전제하고 안심시키는 뉘앙스로 작성할 것.'
            : '';
        const label = data.type === 'recommend'
            ? '추천'
            : data.type === 'caution'
                ? '주의'
                : '비추천';
        const prompt = `
    임신 ${data.week ?? '알 수 없음'}주차, ${data.trimester ?? '알 수 없음'}분기 사용자입니다.
    BMI: ${data.bmi ?? '알 수 없음'}
    현재 증상: ${data.symptoms.join(', ') || '없음'}
    기저 질환/주의 조건: ${data.conditions.join(', ') || '없음'}

    운동명: ${data.exercise.name}
    카테고리: ${data.exercise.category}
    강도: ${data.exercise.intensity}
    자세: ${data.exercise.positionType}
    낙상 위험: ${data.exercise.fallRisk ? '있음' : '없음'}
    운동 설명: ${data.exercise.description}

    서버 Rule Engine 분류: ${label}
    서버 판단 근거: ${data.ruleReasons.join(' / ') || '특이 제한 없음'}
    ${earlyPregnancyGuardrail}

    위 정보를 바탕으로 사용자가 이해할 수 있는 한 문장 설명을 작성하세요.
    운동명은 별도 exercise_name 필드로 제공되므로 답변에 운동명을 반복하지 마세요.
    운동명 뒤에 은/는/이/가 같은 조사를 붙이는 문장으로 시작하지 말고, 설명 본문만 작성하세요.
    예: "수행 가능하지만 최신 증상과 직접적인 긍정 태그가 없어 주의 운동으로 분류된 기준에 따라 강도와 시간을 낮춰 진행하는 것이 좋습니다."
    의료 진단처럼 말하지 말고, 서버의 안전 기준에 따른 운동 안내처럼 작성하세요.
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You explain server-side pregnancy exercise recommendations in Korean. Keep it concise, safe, and non-diagnostic.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.3,
            });
            return (response.choices[0].message.content ??
                this.generateMockRecommendationComment(data));
        }
        catch {
            return this.generateMockRecommendationComment(data);
        }
    }
    generateMockRecommendationComment(data) {
        const reason = data.ruleReasons.length
            ? data.ruleReasons.join(', ')
            : `${data.trimester ?? '현재'}분기 기준과 현재 상태에서 큰 제한 요소가 확인되지 않았습니다`;
        if (data.type === 'not_recommend') {
            return `현재 상태에서는 피하는 것이 좋습니다. 근거: ${reason}.`;
        }
        if (data.type === 'caution') {
            return `수행 가능하지만 강도와 시간을 낮춰 진행하는 것이 좋습니다. 근거: ${reason}.`;
        }
        return `현재 상태에서 비교적 안전하게 시도할 수 있는 운동입니다. 근거: ${reason}.`;
    }
    async generateHealthReport(data) {
        if (!this.isLlmEnabled()) {
            return this.generateMockHealthReport(data);
        }
        const earlyPregnancyGuardrail = data.week <= 13
            ? '주의: 임신 초기(1~13주)이므로 입덧과 식욕 저하로 인해 체중이 줄거나 늘지 않아도 자연스러운 현상임을 전제하고 안심시키는 뉘앙스로 작성할 것.'
            : '';
        const prompt = `
    임신 ${data.week}주차 사용자입니다.
    BMI는 ${data.bmi}이며 체중 상태는 ${data.weightStatus}입니다.
    ${earlyPregnancyGuardrail}

    1. 현재 시기에 맞는 건강 관리 조언
    2. 체중 관리 관련 조언
    3. 주의사항

    을 3~4줄로 작성하세요.
    의료적 진단처럼 말하지 말고 조언 형태로 작성하세요.
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You write safe Korean pregnancy wellness guidance. Never present medical diagnosis.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.4,
            });
            return (response.choices[0].message.content ??
                this.generateMockHealthReport(data));
        }
        catch {
            return this.generateMockHealthReport(data);
        }
    }
    generateMockHealthReport(data) {
        let message = `임신 ${data.week}주차입니다. `;
        if (data.week <= 13) {
            message +=
                '초기에는 입덧과 식욕 저하로 체중이 줄거나 늘지 않아도 자연스러운 경우가 있어 너무 불안해하지 않아도 됩니다. ';
            message += '충분한 휴식과 무리 없는 영양 관리가 중요합니다. ';
        }
        else if (data.week <= 27) {
            message += '중기에는 체중 증가를 안정적으로 관리하는 것이 좋습니다. ';
        }
        else {
            message += '후기에는 낙상 예방과 무리한 활동을 피하는 것이 중요합니다. ';
        }
        if (data.bmi >= 25) {
            message += '체중 증가 속도를 천천히 조절하는 것이 좋겠습니다. ';
        }
        else {
            message += '현재 체중 상태는 비교적 안정적입니다. ';
        }
        message += '균형 잡힌 식사와 가벼운 운동을 꾸준히 유지하세요.';
        return message;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map