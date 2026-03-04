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
const pregnancy_condition_entity_1 = require("../entities/pregnancy-condition.entity");
const user_entity_1 = require("../user/user.entity");
let PregnancyService = class PregnancyService {
    pregnancyRepository;
    weightRepository;
    pregnancyConditionRepository;
    userRepository;
    constructor(pregnancyRepository, weightRepository, pregnancyConditionRepository, userRepository) {
        this.pregnancyRepository = pregnancyRepository;
        this.weightRepository = weightRepository;
        this.pregnancyConditionRepository = pregnancyConditionRepository;
        this.userRepository = userRepository;
    }
    GUIDELINES = {
        1: {
            title: '1분기 운동 가이드라인 (ACOG)',
            items: [
                '심박수 급상승 유발 운동 피하기',
                '복부 압박 동작 최소화',
                '어지러움·출혈 발생 시 즉시 중단',
                '충분한 휴식과 수분 섭취 병행',
            ],
        },
        2: {
            title: '2분기 운동 가이드라인 (ACOG)',
            items: [
                '중간 강도 유산소 운동 가능',
                '복부 직접 압박 동작 피하기',
                '균형 유지 어려운 동작 주의',
                '규칙적인 스트레칭 병행',
            ],
        },
        3: {
            title: '3분기 운동 가이드라인 (ACOG)',
            items: [
                '운동 강도와 시간을 점진적으로 줄이기',
                '낙상 위험이 높은 운동 피하기',
                '골반저근 운동(케겔) 지속',
                '조기 진통 징후 시 즉시 운동 중단',
            ],
        },
        4: {
            title: '4분기 운동 가이드라인 (ACOG)',
            items: [
                '무리한 운동 중단, 안정 위주 활동',
                '짧은 시간 가벼운 보행 권장',
                '복부 긴장 유발 동작 금지',
                '진통 증상 발생 시 즉시 의료 상담',
            ],
        },
    };
    calculateAge(birthInput) {
        const birthDate = birthInput instanceof Date
            ? birthInput
            : new Date(birthInput);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    calculateMaxBpm(age, fitnessLevel, bmi) {
        let maxBpm = 0;
        if (age < 20) {
            maxBpm = fitnessLevel === 'ACTIVE' ? 151 : 125;
        }
        else if (age <= 29) {
            maxBpm = fitnessLevel === 'ACTIVE' ? 161 : 145;
        }
        else if (age <= 39) {
            maxBpm = fitnessLevel === 'ACTIVE' ? 157 : 145;
        }
        else {
            maxBpm = 141;
        }
        if (bmi >= 25) {
            maxBpm -= 10;
        }
        return maxBpm;
    }
    calculateWeek(lmpInput) {
        const lmp = lmpInput instanceof Date
            ? lmpInput
            : new Date(lmpInput);
        const today = new Date();
        const diffDays = (today.getTime() - lmp.getTime()) /
            (1000 * 60 * 60 * 24);
        const week = Math.floor(diffDays / 7);
        return week < 0 ? 0 : week;
    }
    calculateTrimester(week) {
        if (week <= 13)
            return 1;
        if (week <= 26)
            return 2;
        return 3;
    }
    async create(userId, dto) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        const heightMeter = dto.height / 100;
        const bmi = dto.pre_weight / (heightMeter * heightMeter);
        const age = this.calculateAge(user.birth_date);
        const maxBpm = this.calculateMaxBpm(age, dto.fitness_level, bmi);
        const lmp = new Date(dto.last_menstrual_period);
        const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        const pregnancy = await this.pregnancyRepository.save(this.pregnancyRepository.create({
            user_id: userId,
            last_menstrual_period: lmp,
            pregnancy_start_date: lmp,
            due_date: dueDate,
            height: dto.height,
            pre_weight: dto.pre_weight,
            bmi,
            is_multiple: dto.is_multiple ?? null,
            fitness_level: dto.fitness_level,
            max_allowed_bpm: maxBpm,
        }));
        if (dto.conditions?.length) {
            for (const code of dto.conditions) {
                await this.pregnancyConditionRepository.save(this.pregnancyConditionRepository.create({
                    pregnancy_id: pregnancy.pregnancy_id,
                    condition_code: code,
                }));
            }
        }
        return pregnancy;
    }
    async findLatestByUser(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
            relations: ['conditions'],
        });
        if (!pregnancy)
            return null;
        const week = this.calculateWeek(pregnancy.last_menstrual_period);
        const trimester = this.calculateTrimester(week);
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        const age = user ? this.calculateAge(user.birth_date) : 0;
        const recalculatedMaxBpm = this.calculateMaxBpm(age, pregnancy.fitness_level, pregnancy.bmi);
        const latestWeightLog = await this.weightRepository.findOne({
            where: { pregnancy_id: pregnancy.pregnancy_id },
            order: { week: 'DESC' },
        });
        const startWeight = pregnancy.pre_weight;
        const currentWeight = latestWeightLog?.weight ?? startWeight;
        const totalGain = Number((currentWeight - startWeight).toFixed(1));
        return {
            pregnancy_id: pregnancy.pregnancy_id,
            week,
            trimester,
            pre_weight: startWeight,
            current_weight: currentWeight,
            total_gain: totalGain,
            due_date: pregnancy.due_date,
            is_multiple: pregnancy.is_multiple,
            max_allowed_bpm: recalculatedMaxBpm,
            conditions: pregnancy.conditions?.map(c => c.condition_code) ?? [],
        };
    }
    async updateLatestByUser(userId, dto) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
            relations: ['conditions'],
        });
        if (!pregnancy)
            return null;
        if (dto.pre_weight !== undefined) {
            pregnancy.pre_weight = dto.pre_weight;
            const heightMeter = pregnancy.height / 100;
            pregnancy.bmi =
                dto.pre_weight /
                    (heightMeter * heightMeter);
        }
        if (dto.is_multiple !== undefined) {
            pregnancy.is_multiple =
                dto.is_multiple;
        }
        if (dto.due_date) {
            pregnancy.due_date =
                new Date(dto.due_date);
        }
        return this.pregnancyRepository.save(pregnancy);
    }
    async getGuideline(userId) {
        const pregnancy = await this.pregnancyRepository.findOne({
            where: { user_id: userId },
            order: { pregnancy_id: 'DESC' },
        });
        if (!pregnancy) {
            throw new common_1.NotFoundException('임신 정보가 없습니다.');
        }
        const week = this.calculateWeek(pregnancy.last_menstrual_period);
        const trimester = this.calculateTrimester(week);
        const guideline = this.GUIDELINES[trimester];
        return {
            week,
            trimester,
            title: guideline.title,
            guidelines: guideline.items,
        };
    }
    calculateRecommendedWeight(pregnancy) {
        const bmi = pregnancy.bmi;
        if (bmi < 18.5)
            return '12.5–18kg';
        if (bmi < 25)
            return '11.5–16kg';
        if (bmi < 30)
            return '7–11.5kg';
        return '5–9kg';
    }
    getCommonSymptoms(trimester) {
        const symptoms = {
            1: [
                '입덧',
                '피로감',
                '유방 통증',
            ],
            2: [
                '요통',
                '다리 경련',
                '부종 시작',
            ],
            3: [
                '강한 수축',
                '양수 터짐 가능',
                '진통',
            ],
            4: [
                '진통 간격 단축',
                '복부 압박감',
                '출산 임박 신호',
            ],
        };
        return symptoms[trimester] ?? [];
    }
    getDefaultTip(trimester) {
        const tips = {
            1: '무리한 활동을 줄이고 충분한 휴식을 취하세요.',
            2: '규칙적인 가벼운 운동을 유지하세요.',
            3: '수분 섭취를 늘리고 낙상에 주의하세요.',
            4: '진통 증상이 느껴지면 즉시 병원을 방문하세요.',
        };
        return tips[trimester] ?? '건강 상태를 주의 깊게 관찰하세요.';
    }
    async getWeeklyHealth(userId) {
        const latest = await this.findLatestByUser(userId);
        if (!latest) {
            throw new common_1.NotFoundException('임신 정보가 없습니다.');
        }
        const { week, trimester } = latest;
        const recommendedWeight = this.calculateRecommendedWeight(latest);
        const symptoms = this.getCommonSymptoms(trimester);
        const tip = this.getDefaultTip(trimester);
        return {
            week,
            recommended_weight_gain: recommendedWeight,
            common_symptoms: symptoms,
            today_tip: tip,
        };
    }
};
exports.PregnancyService = PregnancyService;
exports.PregnancyService = PregnancyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pregnancy_info_entity_1.PregnancyInfo)),
    __param(1, (0, typeorm_1.InjectRepository)(pregnancy_weight_log_entity_1.PregnancyWeightLog)),
    __param(2, (0, typeorm_1.InjectRepository)(pregnancy_condition_entity_1.PregnancyCondition)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PregnancyService);
//# sourceMappingURL=pregnancy.service.js.map