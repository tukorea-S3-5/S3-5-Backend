import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    createPost(dto: CreatePostDto, req: any): Promise<import("../entities/post.entity").Post>;
    getAllPosts(req: any): Promise<import("./dto/post-list.dto").PostListDto[]>;
    getLikedPosts(req: any): Promise<{
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
    getMyPosts(req: any): Promise<import("./dto/post-list.dto").PostListDto[]>;
    getPost(id: number, req: any): Promise<{
        post: {
            id: number;
            title: string;
            content: string;
            createdAt: Date;
            views: number;
            likes: number;
            user: {
                user_id: string;
                name: string;
                profileImage: string | null;
            };
        };
        comments: import("../entities/comment.entity").Comment[];
        commentsCount: number;
        isLiked: boolean;
    }>;
    createComment(dto: CreateCommentDto, req: any): Promise<import("../entities/comment.entity").Comment>;
    toggleLike(id: number, req: any): Promise<{
        liked: boolean;
        likes: number;
    }>;
}
