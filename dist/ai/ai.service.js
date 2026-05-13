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
    async generateExerciseComment(data) {
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
        const exerciseNamesRaw = data.exercises.map(e => e.name).join(', ');
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
    async generateHealthReport(data) {
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
    generateMockHealthReport(data) {
        let message = `임신 ${data.week}주차입니다. `;
        if (data.week <= 13) {
            message += '초기에는 충분한 휴식과 영양 관리가 중요합니다. ';
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