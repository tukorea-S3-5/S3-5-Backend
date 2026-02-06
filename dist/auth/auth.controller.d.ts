import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { RequestWithRefreshUser, RequestWithUser, RequestWithValidatedUser } from './interfaces/auth.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(req: RequestWithValidatedUser, loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(req: RequestWithRefreshUser): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: RequestWithUser): Promise<{
        message: string;
    }>;
}
