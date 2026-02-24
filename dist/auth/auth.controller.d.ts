import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import type { RequestWithRefreshUser, RequestWithUser, RequestWithValidatedUser } from './interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(LoginDto: LoginDto, req: RequestWithValidatedUser, res: Response): Promise<{
        accessToken: string;
    }>;
    refreshTokens(req: RequestWithRefreshUser, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: RequestWithUser, res: Response): Promise<{
        message: string;
    }>;
}
