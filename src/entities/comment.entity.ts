import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  /**
   * 댓글(Comment) 엔티티
   * 게시글에 대한 사용자 의견 및 소통을 위한 테이블
   */
  @Entity('comments')
  export class Comment {
    /**
     * 댓글 고유 ID (기본 키)
     * 자동 증가(Auto Increment)
     */
    @PrimaryGeneratedColumn()
    id: number;
  
    /**
     * 게시글 ID
     * Post 엔티티의 id를 참조하는 외래 키
     */
    @Column()
    postId: number;
  
    /**
     * 댓글 작성자 ID
     * 사용자 테이블(User)의 id를 참조
     */
    @Column()
    userId: string;
  
    /**
     * 댓글 내용
     * 긴 텍스트 저장을 위해 TEXT 타입 사용
     */
    @Column('text')
    content: string;
  
    /**
     * 댓글 생성 일시
     * 생성 시 자동 저장
     */
    @CreateDateColumn()
    createdAt: Date;
  }