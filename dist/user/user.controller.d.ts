import { UserService } from './user.service';
import { FindEmailDto } from './dto/find-email.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    checkEmailExists(findEmailDto: FindEmailDto): Promise<{
        exists: boolean;
        email: string;
    }>;
}
