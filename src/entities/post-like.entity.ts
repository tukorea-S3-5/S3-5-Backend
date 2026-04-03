import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity()
  @Unique(['userId', 'postId']) // 같은 유저가 같은 게시글 중복 좋아요 방지
  export class PostLike {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: string;
  
    @Column()
    postId: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }