import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommunityService {
    private readonly postRepository;
    private readonly commentRepository;
    private readonly likeRepository;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, likeRepository: Repository<PostLike>);
    createPost(dto: CreatePostDto): Promise<Post>;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: number): Promise<{
        post: Post;
        comments: Comment[];
    }>;
    createComment(dto: CreateCommentDto): Promise<Comment>;
    toggleLike(postId: number, userId: string): Promise<{
        liked: boolean;
        likes: number;
    }>;
}
