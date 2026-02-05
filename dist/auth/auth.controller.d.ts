import { Request as ExpressRequest } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(req: ExpressRequest & {
        user: User;
    }): Promise<{
        access_token: string;
    }>;
}
