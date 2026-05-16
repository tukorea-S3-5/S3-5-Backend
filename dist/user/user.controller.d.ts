import { UserService } from './user.service';
import { FindEmailDto } from './dto/find-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    checkEmailExists(findEmailDto: FindEmailDto): Promise<{
        exists: boolean;
        email: string;
    }>;
    getMe(req: any): Promise<{
        user_id: string;
        email: string;
        name: string;
        birth_date: Date;
        profileImage: string | null;
        created_at: Date;
    }>;
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        message: string;
        name: string;
        profileImage: string | null;
    }>;
}
