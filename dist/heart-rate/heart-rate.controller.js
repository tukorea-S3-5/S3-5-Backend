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
exports.HeartRateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const heart_rate_service_1 = require("./heart-rate.service");
const update_resting_hr_dto_1 = require("./dto/update-resting-hr.dto");
const check_heart_rate_dto_1 = require("./dto/check-heart-rate.dto");
let HeartRateController = class HeartRateController {
    heartRateService;
    constructor(heartRateService) {
        this.heartRateService = heartRateService;
    }
    async updateResting(req, dto) {
        return this.heartRateService.updateRestingHeartRate(req.user.user_id, dto.restingHeartRate);
    }
    async check(req, dto) {
        return this.heartRateService.checkHeartRate(req.user.user_id, dto.currentHeartRate);
    }
    async weekly(req) {
        return this.heartRateService.getWeeklyHeartRate(req.user.user_id);
    }
};
exports.HeartRateController = HeartRateController;
__decorate([
    (0, common_1.Post)('resting'),
    (0, swagger_1.ApiOperation)({ summary: '안정 심박 저장' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_resting_hr_dto_1.UpdateRestingHrDto]),
    __metadata("design:returntype", Promise)
], HeartRateController.prototype, "updateResting", null);
__decorate([
    (0, common_1.Post)('check'),
    (0, swagger_1.ApiOperation)({ summary: '심박 위험 판단' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, check_heart_rate_dto_1.CheckHeartRateDto]),
    __metadata("design:returntype", Promise)
], HeartRateController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({ summary: '주간 심박 통계 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HeartRateController.prototype, "weekly", null);
exports.HeartRateController = HeartRateController = __decorate([
    (0, swagger_1.ApiTags)('HeartRate'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('heart-rate'),
    __metadata("design:paramtypes", [heart_rate_service_1.HeartRateService])
], HeartRateController);
//# sourceMappingURL=heart-rate.controller.js.map