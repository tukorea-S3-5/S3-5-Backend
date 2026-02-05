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
let PregnancyService = class PregnancyService {
    pregnancyRepository;
    constructor(pregnancyRepository) {
        this.pregnancyRepository = pregnancyRepository;
    }
    async create(dto) {
        const startDate = new Date(dto.pregnancy_start_date);
        const today = new Date();
        const diffDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const week = Math.floor(diffDays / 7);
        const heightMeter = dto.height / 100;
        const bmi = dto.pre_weight / (heightMeter * heightMeter);
        const pregnancy = this.pregnancyRepository.create({
            user_id: dto.user_id,
            height: dto.height,
            pre_weight: dto.pre_weight,
            current_weight: dto.current_weight,
            pregnancy_start_date: startDate,
            week,
            trimester: Math.ceil(week / 13),
            bmi,
            is_multiple: dto.is_multiple ?? null,
            ...(dto.due_date && { due_date: new Date(dto.due_date) }),
        });
        return this.pregnancyRepository.save(pregnancy);
    }
    async findLatestByUser(userId) {
        const result = await this.pregnancyRepository.find({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
            take: 1,
        });
        return result[0] ?? null;
    }
    async updateLatestByUser(userId, dto) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
        });
        if (!pregnancy) {
            return null;
        }
        if (dto.current_weight !== undefined) {
            pregnancy.current_weight = dto.current_weight;
            const heightMeter = pregnancy.height / 100;
            pregnancy.bmi = pregnancy.pre_weight / (heightMeter * heightMeter);
        }
        if (dto.due_date) {
            pregnancy.due_date = new Date(dto.due_date);
        }
        if (dto.is_multiple !== undefined) {
            pregnancy.is_multiple = dto.is_multiple;
        }
        return this.pregnancyRepository.save(pregnancy);
    }
};
exports.PregnancyService = PregnancyService;
exports.PregnancyService = PregnancyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PregnancyService);
//# sourceMappingURL=pregnancy.service.js.map