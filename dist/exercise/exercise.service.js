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
exports.ExerciseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_session_entity_1 = require("../entities/exercise-session.entity");
let ExerciseService = class ExerciseService {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async startExercise(userId, dto) {
        const ongoing = await this.sessionRepository.findOne({
            where: {
                user_id: userId,
                status: 'ONGOING',
            },
        });
        if (ongoing) {
            throw new common_1.BadRequestException('이미 진행 중인 운동이 있습니다.');
        }
        const session = this.sessionRepository.create({
            user_id: userId,
            exercise_type: dto.exercise_type ?? null,
            started_at: new Date(),
            status: 'ONGOING',
        });
        return this.sessionRepository.save(session);
    }
    async endExercise(userId) {
        const session = await this.sessionRepository.findOne({
            where: {
                user_id: userId,
                status: 'ONGOING',
            },
        });
        if (!session) {
            throw new common_1.BadRequestException('진행 중인 운동이 없습니다.');
        }
        session.ended_at = new Date();
        session.status = 'COMPLETED';
        return this.sessionRepository.save(session);
    }
};
exports.ExerciseService = ExerciseService;
exports.ExerciseService = ExerciseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_session_entity_1.ExerciseSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExerciseService);
//# sourceMappingURL=exercise.service.js.map