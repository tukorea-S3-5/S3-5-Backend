import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

/**
 * 댓글(Comment) 엔티티
 */
@Entity('comments')
export class Comment {
  /**
   * 댓글 ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 게시글 ID
   */
  @Column()
  postId: number;

  /**
   * 작성자 ID
   */
  @Column()
  userId: string;

  /**
   * 게시글 relation
   */
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  /**
   * 작성자 relation
   */
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 댓글 내용
   */
  @Column('text')
  content: string;

  /**
   * 생성일
   */
  @CreateDateColumn()
  createdAt: Date;
}