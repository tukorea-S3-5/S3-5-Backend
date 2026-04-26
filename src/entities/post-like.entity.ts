import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

/**
 * 게시글 좋아요 엔티티
 */
@Entity('post_likes')
@Unique(['userId', 'postId'])
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 사용자 ID
   */
  @Column()
  userId: string;

  /**
   * 게시글 ID
   */
  @Column()
  postId: number;

  /**
   * 게시글 relation
   */
  @ManyToOne(() => Post, (post) => post.likesList)
  @JoinColumn({ name: 'postId' })
  post: Post;

  /**
   * 사용자 relation
   */
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 생성일
   */
  @CreateDateColumn()
  createdAt: Date;
}