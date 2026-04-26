import { Post } from './post.entity';
import { User } from '../user/user.entity';
export declare class Comment {
    id: number;
    postId: number;
    userId: string;
    post: Post;
    user: User;
    content: string;
    createdAt: Date;
}
