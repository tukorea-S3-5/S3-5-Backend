import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
export declare class Post {
    id: number;
    userId: string;
    user: User;
    title: string;
    content: string;
    category: string;
    comments: Comment[];
    likesList: PostLike[];
    views: number;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}
