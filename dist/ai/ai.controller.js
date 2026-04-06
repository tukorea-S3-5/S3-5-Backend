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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const passport_1 = require("@nestjs/passport");
const create_health_report_dto_1 = require("./dto/create-health-report.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateHealthReport(dto) {
        const report = await this.aiService.generateHealthReport(dto);
        return { report };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('health-report'),
    (0, swagger_1.ApiOperation)({
        summary: '임산부 건강 리포트 생성',
        description: '임신 주차, BMI 정보를 기반으로 AI가 맞춤형 건강 조언을 생성합니다.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                week: 16,
                bmi: 22.5,
                weightStatus: '정상',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '건강 리포트 생성 성공',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패 (JWT 필요)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_health_report_dto_1.CreateHealthReportDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateHealthReport", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('LLM AI'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map