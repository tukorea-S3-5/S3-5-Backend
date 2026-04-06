import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
  ) {}

  // 게시글 작성
  async createPost(dto: CreatePostDto) {
    const post = this.postRepository.create(dto);
    return await this.postRepository.save(post);
  }

  // 게시글 목록 조회
  async getAllPosts() {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 게시글 상세 조회
  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
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

  // 댓글 작성
  async createComment(dto: CreateCommentDto) {
    const comment = this.commentRepository.create(dto);
    return await this.commentRepository.save(comment);
  }

  // 좋아요 토글 
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
}