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
exports.PregnancyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const pregnancy_weight_log_entity_1 = require("../entities/pregnancy-weight-log.entity");
const user_entity_1 = require("../user/user.entity");
let PregnancyService = class PregnancyService {
    pregnancyRepository;
    weightRepository;
    userRepository;
    constructor(pregnancyRepository, weightRepository, userRepository) {
        this.pregnancyRepository = pregnancyRepository;
        this.weightRepository = weightRepository;
        this.userRepository = userRepository;
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    calculateMaxBpm(age, fitnessLevel) {
        if (age < 20) {
            return fitnessLevel === 'ACTIVE' ? 151 : 125;
        }
        else if (age >= 20 && age <= 29) {
            return fitnessLevel === 'ACTIVE' ? 161 : 145;
        }
        else if (age >= 30 && age <= 39) {
            return fitnessLevel === 'ACTIVE' ? 157 : 145;
        }
        else {
            return 141;
        }
    }
    async create(userId, dto) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        const age = this.calculateAge(new Date(user.birth_date));
        const maxBpm = this.calculateMaxBpm(age, dto.fitness_level);
        const lmp = new Date(dto.last_menstrual_period);
        const today = new Date();
        const diffDays = (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24);
        const week = Math.floor(diffDays / 7);
        const calculatedDueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        const finalDueDate = calculatedDueDate;
        const heightMeter = dto.height / 100;
        const bmi = dto.pre_weight / (heightMeter * heightMeter);
        const pregnancy = this.pregnancyRepository.create({
            user_id: userId,
            last_menstrual_period: lmp,
            pregnancy_start_date: lmp,
            week,
            trimester: Math.ceil(week / 13),
            due_date: finalDueDate,
            height: dto.height,
            pre_weight: dto.pre_weight,
            bmi,
            is_multiple: dto.is_multiple ?? null,
            fitness_level: dto.fitness_level,
            contraindication: dto.contraindication,
            max_allowed_bpm: maxBpm,
        });
        return this.pregnancyRepository.save(pregnancy);
    }
    async findLatestByUser(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
        });
        if (!pregnancy)
            return null;
        const latestWeightLog = await this.weightRepository.findOne({
            where: { pregnancy_id: pregnancy.pregnancy_id },
            order: { week: 'DESC' },
        });
        const startWeight = pregnancy.pre_weight;
        const currentWeight = latestWeightLog
            ? latestWeightLog.weight
            : startWeight;
        const totalGain = Number((currentWeight - startWeight).toFixed(1));
        return {
            pregnancy_id: pregnancy.pregnancy_id,
            week: pregnancy.week,
            trimester: pregnancy.trimester,
            pre_weight: startWeight,
            current_weight: currentWeight,
            total_gain: totalGain,
            due_date: pregnancy.due_date,
            is_multiple: pregnancy.is_multiple,
            max_allowed_bpm: pregnancy.max_allowed_bpm,
        };
    }
    async updateLatestByUser(userId, dto) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
        });
        if (!pregnancy)
            return null;
        if (dto.pre_weight !== undefined) {
            pregnancy.pre_weight = dto.pre_weight;
            const heightMeter = pregnancy.height / 100;
            pregnancy.bmi = dto.pre_weight / (heightMeter * heightMeter);
        }
        if (dto.is_multiple !== undefined) {
            pregnancy.is_multiple = dto.is_multiple;
        }
        if (dto.due_date) {
            pregnancy.due_date = new Date(dto.due_date);
        }
        return this.pregnancyRepository.save(pregnancy);
    }
};
exports.PregnancyService = PregnancyService;
exports.PregnancyService = PregnancyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __param(1, (0, typeorm_1.InjectRepository)(pregnancy_weight_log_entity_1.PregnancyWeightLog)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PregnancyService);
//# sourceMappingURL=pregnancy.service.js.map