import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';
export declare class CommunityService {
    private readonly postRepository;
    private readonly commentRepository;
    private readonly likeRepository;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, likeRepository: Repository<PostLike>);
    createPost(title: string, content: string, userId: string): Promise<Post>;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: number): Promise<{
        post: Post;
        comments: Comment[];
    }>;
    createComment(postId: number, content: string, userId: string): Promise<Comment>;
    toggleLike(postId: number, userId: string): Promise<{
        liked: boolean;
        likes: number;
    }>;
}
