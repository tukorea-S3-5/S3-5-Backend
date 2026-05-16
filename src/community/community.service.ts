import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostListDto } from './dto/post-list.dto';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
  ) { }

  /**
   * 게시글 작성
   * - 로그인 유저 ID를 기반으로 저장
   */
  async createPost(title: string, content: string, userId: string) {
    const post = this.postRepository.create({
      title,
      content,
      userId,
    });

    return await this.postRepository.save(post);
  }

  /**
   * 게시글 목록 조회
   * - user 정보까지 함께 조회
   * - 댓글 수 추가
   * - 현재 로그인 유저 기준 isLiked 추가
   * - 목록에서는 views 반환하지 않음
   */
  async getAllPosts(currentUserId: string): Promise<PostListDto[]> {
    const posts = await this.postRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const result: PostListDto[] = [];

    for (const post of posts) {
      const commentsCount = await this.commentRepository.count({
        where: { postId: post.id },
      });

      const isLiked = await this.likeRepository.exist({
        where: {
          postId: post.id,
          userId: currentUserId,
        },
      });

      result.push({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        user: {
          user_id: post.user.user_id,
          name: post.user.name,
          profileImage: post.user.profileImage,
        },
        likes: post.likes,
        commentsCount,
        isLiked,
      });
    }

    return result;
  }

  /**
   * 게시글 상세 조회
   * - 조회수 증가 처리
   * - 댓글 포함 반환
   */
  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    post.views += 1;
    await this.postRepository.save(post);

    const comments = await this.commentRepository.find({
      where: { postId: id },
      order: { createdAt: 'ASC' },
    });

    return { post, comments };
  }

  /**
   * 댓글 작성
   */
  async createComment(postId: number, content: string, userId: string) {
    const comment = this.commentRepository.create({
      postId,
      content,
      userId,
    });

    return await this.commentRepository.save(comment);
  }

  /**
   * 좋아요 토글
   */
  async toggleLike(postId: number, userId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    // 이미 좋아요 했으면 → 취소
    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      post.likes -= 1;
      await this.postRepository.save(post);

      return { liked: false, likes: post.likes };
    }

    // 좋아요 안 했으면 → 추가
    const like = this.likeRepository.create({ postId, userId });
    await this.likeRepository.save(like);

    post.likes += 1;
    await this.postRepository.save(post);

    return { liked: true, likes: post.likes };
  }

  /**
 * 내가 좋아요 누른 게시글 목록 조회
 */
  async getLikedPosts(userId: string) {
    const likes = await this.likeRepository.find({
      where: { userId },
      relations: ['post', 'post.user'],
      order: { createdAt: 'DESC' }, // PostLike에 createdAt이 있다면
    });

    return likes.map(like => ({
      id: like.post.id,
      title: like.post.title,
      content: like.post.content,
      createdAt: like.post.createdAt,
      user: {
        user_id: like.post.user.user_id,
        name: like.post.user.name,
        profileImage: like.post.user.profileImage,
      },
      likes: like.post.likes,
    }));
  }

  /**
   * 내가 작성한 게시글 목록 조회
   */
  async getMyPosts(userId: string): Promise<PostListDto[]> {
    const posts = await this.postRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  
    const result: PostListDto[] = [];
  
    for (const post of posts) {
      const commentsCount = await this.commentRepository.count({
        where: { postId: post.id },
      });
  
      result.push({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        user: {
          user_id: post.user.user_id,
          name: post.user.name,
          profileImage: post.user.profileImage,
        },
        likes: post.likes,
        commentsCount,
        isLiked: false,
      });
    }
    return result;
  }
}