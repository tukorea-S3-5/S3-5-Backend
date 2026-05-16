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
const heart_rate_record_entity_1 = require("./heart-rate-record.entity");
let HeartRateService = class HeartRateService {
    userRepository;
    heartRateRepository;
    constructor(userRepository, heartRateRepository) {
        this.userRepository = userRepository;
        this.heartRateRepository = heartRateRepository;
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
        await this.heartRateRepository.save({
            user_id: userId,
            bpm: currentHeartRate,
        });
        return {
            status,
            maxHR,
            restingHR: user.restingHeartRate,
        };
    }
    async getWeeklyHeartRate(userId) {
        const now = new Date();
        const start = new Date();
        start.setDate(now.getDate() - 7);
        const records = await this.heartRateRepository.find({
            where: {
                user_id: userId,
                created_at: (0, typeorm_2.Between)(start, now),
            },
            order: {
                created_at: 'ASC',
            },
        });
        if (!records.length) {
            return {
                average: null,
                max: null,
                count: 0,
                records: [],
            };
        }
        const avg = Math.round(records.reduce((sum, r) => sum + r.bpm, 0) / records.length);
        const max = Math.max(...records.map(r => r.bpm));
        return {
            average: avg,
            max,
            count: records.length,
            records: records.map(r => ({
                bpm: r.bpm,
                created_at: r.created_at,
            })),
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
    __param(1, (0, typeorm_1.InjectRepository)(heart_rate_record_entity_1.HeartRateRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HeartRateService);
//# sourceMappingURL=heart-rate.service.js.map