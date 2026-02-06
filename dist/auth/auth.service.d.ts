import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
export interface ValidatedUser {
    user_id: string;
    email: string;
    name: string;
    age: number | null;
    created_at: Date;
    currentRefreshToken: string | null;
}
export declare class AuthService {
    private userRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    signUp(createUserDto: CreateUserDto): Promise<void>;
    validateUser(email: string, password: string): Promise<ValidatedUser | null>;
    login(user: ValidatedUser): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getTokens(userId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
