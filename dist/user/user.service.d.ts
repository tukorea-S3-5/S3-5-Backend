import { User } from './user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    getMe(userId: string): Promise<{
        user_id: string;
        email: string;
        name: string;
        birth_date: Date;
        profileImage: string | null;
        created_at: Date;
    }>;
    updateMe(userId: string, name?: string, profileImage?: string): Promise<{
        message: string;
        name: string;
        profileImage: string | null;
    }>;
}
