import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';

/**
 * 게시글(Post) 엔티티
 * - 커뮤니티 피드 데이터
 */
@Entity('posts')
export class Post {
  /**
   * 게시글 고유 ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 작성자 ID (FK)
   */
  @Column()
  userId: string;

  /**
   * 작성자 정보 relation
   * - 여러 게시글은 한 명의 사용자에게 속함
   */
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 게시글 제목
   */
  @Column()
  title: string;

  /**
   * 게시글 내용
   */
  @Column('text')
  content: string;

  /**
   * 게시글 카테고리
   */
  @Column({ default: 'FREE' })
  category: string;

  /**
   * 댓글 리스트
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  /**
   * 좋아요 리스트
   */
  @OneToMany(() => PostLike, (like) => like.post)
  likesList: PostLike[];

  /**
   * 조회수
   */
  @Column({ default: 0 })
  views: number;

  /**
   * 좋아요 수 (집계용)
   */
  @Column({ default: 0 })
  likes: number;

  /**
   * 생성일
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 수정일
   */
  @UpdateDateColumn()
  updatedAt: Date;
}