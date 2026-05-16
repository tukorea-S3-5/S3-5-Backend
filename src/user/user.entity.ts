import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';

/**
 * 사용자 엔티티
 * - 인증 + 커뮤니티 작성자 역할
 */
@Entity('user')
export class User {
  /**
   * 사용자 고유 ID (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  /**
   * 이메일 (로그인 ID)
   */
  @Column({ length: 100, unique: true })
  email: string;

  /**
   * 비밀번호 (조회 시 기본 제외)
   */
  @Column({ length: 255, select: false })
  password: string;

  /**
   * 사용자 이름
   */
  @Column({ length: 50 })
  name: string;

  /**
   * 생년월일
   */
  @Column({ type: 'date' })
  birth_date: Date;

  /**
   * 계정 생성일
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * 현재 리프레시 토큰 (보안상 기본 조회 제외)
   */
  @Column({
    nullable: true,
    type: 'varchar',
    length: 300,
    select: false,
  })
  currentRefreshToken: string | null;

  /**
   * 사용자가 작성한 게시글
   */
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  /**
   * 사용자가 작성한 댓글
   */
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  /**
   * 사용자가 누른 좋아요
   */
  @OneToMany(() => PostLike, (like) => like.user)
  likes: PostLike[];

  /**
   * 비밀번호 해싱
   */
  async hashPassword(plainTextPassword: string): Promise<void> {
    this.password = await bcrypt.hash(plainTextPassword, 10);
  }

  /**
   * 비밀번호 비교 (로그인 시 호출)
   */
  async comparePassword(
    plainTextPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.password);
  }

  /**
   * 리프레시 토큰 해싱 및 설정
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    this.currentRefreshToken = await bcrypt.hash(refreshToken, 10);
  }

  /**
   * 리프레시 토큰 비교 (토큰 갱신 시 호출)
   */
  async compareRefreshToken(
    refreshToken: string,
  ): Promise<boolean> {
    if (!this.currentRefreshToken) return false;
    return await bcrypt.compare(
      refreshToken,
      this.currentRefreshToken,
    );
  }

  /**
   * 로그아웃 시 RT 제거
   */
  removeRefreshToken() {
    this.currentRefreshToken = null;
  }

  /**
 * 최근 측정한 안정 심박수
 */
  @Column({ type: 'int', nullable: true })
  restingHeartRate: number | null;

  /**
   * 안정 심박 마지막 측정 시간
   */
  @Column({ type: 'timestamp', nullable: true })
  restingHeartRateUpdatedAt: Date | null;

  /**
  * 프로필 이미지 URL
  */
  @Column({ type: 'varchar', length: 300, nullable: true })
  profileImage: string | null;
}