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
exports.PregnancyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const pregnancy_service_1 = require("./pregnancy.service");
const create_pregnancy_dto_1 = require("./dto/create-pregnancy.dto");
const update_pregnancy_dto_1 = require("./dto/update-pregnancy.dto");
let PregnancyController = class PregnancyController {
    pregnancyService;
    constructor(pregnancyService) {
        this.pregnancyService = pregnancyService;
    }
    create(req, dto) {
        return this.pregnancyService.create(req.user.user_id, dto);
    }
    findMyLatest(req) {
        return this.pregnancyService.findLatestByUser(req.user.user_id);
    }
    updateMyLatest(req, dto) {
        return this.pregnancyService.updateLatestByUser(req.user.user_id, dto);
    }
};
exports.PregnancyController = PregnancyController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '임신 정보 등록' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pregnancy_dto_1.CreatePregnancyDto]),
    __metadata("design:returntype", void 0)
], PregnancyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: '내 최신 임신 정보 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PregnancyController.prototype, "findMyLatest", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: '내 최신 임신 정보 수정' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_pregnancy_dto_1.UpdatePregnancyDto]),
    __metadata("design:returntype", void 0)
], PregnancyController.prototype, "updateMyLatest", null);
exports.PregnancyController = PregnancyController = __decorate([
    (0, swagger_1.ApiTags)('Pregnancy'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('pregnancy'),
    __metadata("design:paramtypes", [pregnancy_service_1.PregnancyService])
], PregnancyController);
//# sourceMappingURL=pregnancy.controller.js.map