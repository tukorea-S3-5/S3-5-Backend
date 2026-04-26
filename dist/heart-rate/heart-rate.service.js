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
exports.HeartRateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let HeartRateService = class HeartRateService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async updateRestingHeartRate(userId, restingHeartRate) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('사용자가 존재하지 않습니다.');
        }
        user.restingHeartRate = restingHeartRate;
        user.restingHeartRateUpdatedAt = new Date();
        await this.userRepository.save(user);
        return {
            message: '안정 심박수가 저장되었습니다.',
            restingHeartRate: user.restingHeartRate,
        };
    }
    async checkHeartRate(userId, currentHeartRate) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('사용자가 존재하지 않습니다.');
        }
        if (!user.birth_date) {
            throw new common_1.BadRequestException('생년월일 정보가 없습니다.');
        }
        const birthDate = new Date(user.birth_date);
        const age = this.calculateAge(birthDate);
        const maxHR = 220 - age;
        let status = 'normal';
        if (currentHeartRate >= maxHR) {
            status = 'danger';
        }
        else if (user.restingHeartRate !== null &&
            currentHeartRate >= user.restingHeartRate + 40) {
            status = 'warning';
        }
        return {
            status,
            maxHR,
            restingHR: user.restingHeartRate,
        };
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
};
exports.HeartRateService = HeartRateService;
exports.HeartRateService = HeartRateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HeartRateService);
//# sourceMappingURL=heart-rate.service.js.map