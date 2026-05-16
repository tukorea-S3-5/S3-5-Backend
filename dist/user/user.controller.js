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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const find_email_dto_1 = require("./dto/find-email.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const passport_1 = require("@nestjs/passport");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async checkEmailExists(findEmailDto) {
        const { email } = findEmailDto;
        const user = await this.userService.findByEmail(email);
        return {
            exists: !!user,
            email: email,
        };
    }
    async getMe(req) {
        return this.userService.getMe(req.user.user_id);
    }
    async updateMe(req, dto) {
        return this.userService.updateMe(req.user.user_id, dto.name, dto.profileImage);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/check-email-exists'),
    (0, swagger_1.ApiOperation)({ summary: '이메일 중복 확인' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_email_dto_1.FindEmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkEmailExists", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)('/me'),
    (0, swagger_1.ApiOperation)({ summary: '내 정보 조회' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Put)('/me'),
    (0, swagger_1.ApiOperation)({ summary: '내 정보 수정' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map