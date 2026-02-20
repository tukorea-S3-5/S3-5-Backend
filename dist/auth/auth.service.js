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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../user/user.entity");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    configService;
    constructor(userRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signUp(createUserDto) {
        const { email, password, name, birth_date } = createUserDto;
        const user = this.userRepository.create({
            email,
            name,
            birth_date,
        });
        await user.hashPassword(password);
        try {
            await this.userRepository.save(user);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                throw new common_1.BadRequestException('이미 존재하는 이메일입니다.');
            }
            else {
                console.error('회원가입 중 예상치 못한 DB 에러 발생:', error);
                throw new common_1.InternalServerErrorException('회원가입 처리에 실패했습니다.');
            }
        }
    }
    async validateUser(email, password) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
        if (!user)
            return null;
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            const { password: _password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const userId = user.user_id;
        const email = user.email;
        const tokens = await this.getTokens(userId, email);
        const userEntity = await this.userRepository.findOneBy({
            user_id: userId,
        });
        if (!userEntity) {
            throw new common_1.NotFoundException('로그인 과정에서 사용자를 찾을 수 없습니다.');
        }
        await userEntity.setRefreshToken(tokens.refreshToken);
        await this.userRepository.save(userEntity);
        return tokens;
    }
    async logout(userId) {
        const user = await this.userRepository.findOneBy({ user_id: userId });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        user.removeRefreshToken();
        await this.userRepository.save(user);
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.currentRefreshToken')
            .where('user.user_id = :userId', { userId })
            .getOne();
        if (!user || !user.currentRefreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const isMatch = await user.compareRefreshToken(refreshToken);
        if (!isMatch)
            throw new common_1.ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.user_id, user.email);
        await user.setRefreshToken(tokens.refreshToken);
        await this.userRepository.save(user);
        return tokens;
    }
    async getTokens(userId, email) {
        const payload = { sub: userId, email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME')),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_TIME')),
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map