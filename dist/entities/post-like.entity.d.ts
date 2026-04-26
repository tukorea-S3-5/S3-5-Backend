import { Post } from './post.entity';
import { User } from '../user/user.entity';
export declare class PostLike {
    id: number;
    userId: string;
    postId: number;
    post: Post;
    user: User;
    createdAt: Date;
}
