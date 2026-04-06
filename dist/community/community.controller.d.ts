import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    createPost(dto: CreatePostDto): Promise<import("../entities/post.entity").Post>;
    getAllPosts(): Promise<import("../entities/post.entity").Post[]>;
    getPost(id: number): Promise<{
        post: import("../entities/post.entity").Post;
        comments: import("../entities/comment.entity").Comment[];
    }>;
    createComment(dto: CreateCommentDto): Promise<import("../entities/comment.entity").Comment>;
    toggleLike(id: number, req: any): Promise<{
        liked: boolean;
        likes: number;
    }>;
}
