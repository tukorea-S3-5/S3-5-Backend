import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';
export declare class User {
    user_id: string;
    email: string;
    password: string;
    name: string;
    birth_date: Date;
    created_at: Date;
    currentRefreshToken: string | null;
    posts: Post[];
    comments: Comment[];
    likes: PostLike[];
    hashPassword(plainTextPassword: string): Promise<void>;
    comparePassword(plainTextPassword: string): Promise<boolean>;
    setRefreshToken(refreshToken: string): Promise<void>;
    compareRefreshToken(refreshToken: string): Promise<boolean>;
    removeRefreshToken(): void;
    restingHeartRate: number | null;
    restingHeartRateUpdatedAt: Date | null;
}
