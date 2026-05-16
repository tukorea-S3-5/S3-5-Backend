// 목록 전용 DTO
export class PostListDto {
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
    commentsCount: number;
    isLiked: boolean;
  }