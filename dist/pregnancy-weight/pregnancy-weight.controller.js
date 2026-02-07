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
exports.PregnancyWeightController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const pregnancy_weight_service_1 = require("./pregnancy-weight.service");
const create_weight_log_dto_1 = require("./dto/create-weight-log.dto");
const update_weight_log_dto_1 = require("./dto/update-weight-log.dto");
let PregnancyWeightController = class PregnancyWeightController {
    pregnancyWeightService;
    constructor(pregnancyWeightService) {
        this.pregnancyWeightService = pregnancyWeightService;
    }
    addWeight(req, dto) {
        return this.pregnancyWeightService.addWeight(req.user.user_id, dto);
    }
    getMyWeightLogs(req) {
        return this.pregnancyWeightService.getMyWeightLogs(req.user.user_id);
    }
    updateWeight(req, week, dto) {
        return this.pregnancyWeightService.updateWeight(req.user.user_id, Number(week), dto);
    }
};
exports.PregnancyWeightController = PregnancyWeightController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '임신 주차별 체중 기록 등록' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_weight_log_dto_1.CreateWeightLogDto]),
    __metadata("design:returntype", void 0)
], PregnancyWeightController.prototype, "addWeight", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '임신 주차별 체중 기록 + 체중 증가 요약 조회',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PregnancyWeightController.prototype, "getMyWeightLogs", null);
__decorate([
    (0, common_1.Put)(':week'),
    (0, swagger_1.ApiOperation)({ summary: '임신 주차별 체중 기록 수정' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('week')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_weight_log_dto_1.UpdateWeightLogDto]),
    __metadata("design:returntype", void 0)
], PregnancyWeightController.prototype, "updateWeight", null);
exports.PregnancyWeightController = PregnancyWeightController = __decorate([
    (0, swagger_1.ApiTags)('Pregnancy Weight'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('pregnancy/weight'),
    __metadata("design:paramtypes", [pregnancy_weight_service_1.PregnancyWeightService])
], PregnancyWeightController);
//# sourceMappingURL=pregnancy-weight.controller.js.map