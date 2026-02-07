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
exports.PregnancyWeightService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const pregnancy_weight_log_entity_1 = require("../entities/pregnancy-weight-log.entity");
let PregnancyWeightService = class PregnancyWeightService {
    pregnancyRepository;
    weightRepository;
    constructor(pregnancyRepository, weightRepository) {
        this.pregnancyRepository = pregnancyRepository;
        this.weightRepository = weightRepository;
    }
    async addWeight(userId, dto) {
        const pregnancy = await this.getLatestPregnancy(userId);
        const exists = await this.weightRepository.findOne({
            where: {
                pregnancy_id: pregnancy.pregnancy_id,
                week: dto.week,
            },
        });
        if (exists) {
            throw new common_1.BadRequestException('해당 주차의 체중 기록이 이미 존재합니다.');
        }
        const log = this.weightRepository.create({
            pregnancy_id: pregnancy.pregnancy_id,
            week: dto.week,
            weight: dto.weight,
        });
        return this.weightRepository.save(log);
    }
    async updateWeight(userId, week, dto) {
        const pregnancy = await this.getLatestPregnancy(userId);
        const log = await this.weightRepository.findOne({
            where: {
                pregnancy_id: pregnancy.pregnancy_id,
                week,
            },
        });
        if (!log) {
            throw new common_1.BadRequestException('해당 주차의 체중 기록이 없습니다.');
        }
        log.weight = dto.weight;
        return this.weightRepository.save(log);
    }
    async getMyWeightLogs(userId) {
        const pregnancy = await this.getLatestPregnancy(userId);
        const logs = await this.weightRepository.find({
            where: { pregnancy_id: pregnancy.pregnancy_id },
            order: { week: 'ASC' },
        });
        const startWeight = pregnancy.pre_weight;
        const currentWeight = logs.length > 0
            ? logs[logs.length - 1].weight
            : startWeight;
        const totalGain = Number((currentWeight - startWeight).toFixed(1));
        return {
            summary: {
                start_weight: startWeight,
                current_weight: currentWeight,
                total_gain: totalGain,
            },
            logs,
        };
    }
    async getLatestPregnancy(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
        });
        if (!pregnancy) {
            throw new common_1.BadRequestException('임신 정보가 없습니다.');
        }
        return pregnancy;
    }
};
exports.PregnancyWeightService = PregnancyWeightService;
exports.PregnancyWeightService = PregnancyWeightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __param(1, (0, typeorm_1.InjectRepository)(pregnancy_weight_log_entity_1.PregnancyWeightLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PregnancyWeightService);
//# sourceMappingURL=pregnancy-weight.service.js.map