import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class UserAlreadyExistsError extends Error {
    constructor(message?: string);
}
export declare class AuthService {
    private readonly userRepository;
    private userService;
    private jwtService;
    constructor(userRepository: Repository<User>, userService: UserService, jwtService: JwtService);
    signUp(createUserDto: CreateUserDto): Promise<void>;
    createPassword(plainPassword: string): Promise<string>;
    validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null>;
    login(user: Omit<User, 'password'>): Promise<{
        access_token: string;
    }>;
}
