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
exports.SymptomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const symptom_log_entity_1 = require("../entities/symptom-log.entity");
let SymptomService = class SymptomService {
    symptomRepository;
    constructor(symptomRepository) {
        this.symptomRepository = symptomRepository;
    }
    async createSymptoms(userId, symptoms) {
        if (!symptoms || symptoms.length === 0) {
            throw new common_1.BadRequestException('최소 1개 이상의 증상을 선택해야 합니다.');
        }
        const symptomLog = this.symptomRepository.create({
            user_id: userId,
            symptoms,
        });
        return this.symptomRepository.save(symptomLog);
    }
    async getHistory(userId) {
        return this.symptomRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }
    async getLatestSymptoms(userId) {
        const latest = await this.symptomRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        if (!latest) {
            throw new common_1.BadRequestException('입력된 증상이 없습니다.');
        }
        return latest.symptoms;
    }
};
exports.SymptomService = SymptomService;
exports.SymptomService = SymptomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(symptom_log_entity_1.SymptomLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SymptomService);
//# sourceMappingURL=symptom.service.js.map