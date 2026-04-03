import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  /**
   * 게시글(Post) 엔티티
   * 임산부 사용자들이 정보를 공유하고 소통할 수 있는 커뮤니티 게시판 테이블
   */
  @Entity('posts')
  export class Post {
    /**
     * 게시글 고유 ID (기본 키)
     * 자동 증가(Auto Increment)
     */
    @PrimaryGeneratedColumn()
    id: number;
  
    /**
     * 작성자 ID
     * 사용자 테이블(User)과 연관되는 외래 키 역할
     */
    @Column()
    userId: string;
  
    /**
     * 게시글 제목
     */
    @Column()
    title: string;
  
    /**
     * 게시글 내용
     * 긴 텍스트 저장을 위해 TEXT 타입 사용
     */
    @Column('text')
    content: string;
  
    /**
     * 게시글 카테고리
     * 예: FREE, EXERCISE, DIET, PREGNANCY, POSTPARTUM
     */
    @Column({ default: 'FREE' })
    category: string;
  
    /**
     * 조회수
     * 게시글 상세 조회 시 1씩 증가
     */
    @Column({ default: 0 })
    views: number;
  
    /**
     * 좋아요 수
     * 사용자 반응을 나타내는 지표
     */
    @Column({ default: 0 })
    likes: number;
  
    /**
     * 게시글 생성 일시
     * 데이터 생성 시 자동 저장
     */
    @CreateDateColumn()
    createdAt: Date;
  
    /**
     * 게시글 수정 일시
     * 데이터 수정 시 자동 갱신
     */
    @UpdateDateColumn()
    updatedAt: Date;
  }