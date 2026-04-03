import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, PostLike])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}