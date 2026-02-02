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
const pregnancy_service_1 = require("./pregnancy.service");
const create_pregnancy_dto_1 = require("./dto/create-pregnancy.dto");
const update_pregnancy_dto_1 = require("./dto/update-pregnancy.dto");
let PregnancyController = class PregnancyController {
    pregnancyService;
    constructor(pregnancyService) {
        this.pregnancyService = pregnancyService;
    }
    create(dto) {
        return this.pregnancyService.create(dto);
    }
    async getLatestPregnancy(userId) {
        return this.pregnancyService.findLatestByUser(userId);
    }
    updateLatest(userId, dto) {
        return this.pregnancyService.updateLatestByUser(userId, dto);
    }
};
exports.PregnancyController = PregnancyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pregnancy_dto_1.CreatePregnancyDto]),
    __metadata("design:returntype", void 0)
], PregnancyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PregnancyController.prototype, "getLatestPregnancy", null);
__decorate([
    (0, common_1.Put)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pregnancy_dto_1.UpdatePregnancyDto]),
    __metadata("design:returntype", void 0)
], PregnancyController.prototype, "updateLatest", null);
exports.PregnancyController = PregnancyController = __decorate([
    (0, common_1.Controller)('pregnancy'),
    __metadata("design:paramtypes", [pregnancy_service_1.PregnancyService])
], PregnancyController);
//# sourceMappingURL=pregnancy.controller.js.map