import { Repository } from 'typeorm';
import { PostListDto } from './dto/post-list.dto';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';
export declare class CommunityService {
    private readonly postRepository;
    private readonly commentRepository;
    private readonly likeRepository;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, likeRepository: Repository<PostLike>);
    createPost(title: string, content: string, userId: string): Promise<Post>;
    getAllPosts(currentUserId: string): Promise<PostListDto[]>;
    getPostById(id: number): Promise<{
        post: Post;
        comments: Comment[];
    }>;
    createComment(postId: number, content: string, userId: string): Promise<Comment>;
    toggleLike(postId: number, userId: string): Promise<{
        liked: boolean;
        likes: number;
    }>;
    getLikedPosts(userId: string): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        user: {
            user_id: string;
            name: string;
            profileImage: string | null;
        };
        likes: number;
    }[]>;
    getMyPosts(userId: string): Promise<PostListDto[]>;
}
