import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Community')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  /**
   * 게시글 작성
   * - JWT 기반 로그인 유저로 저장
   */
  @Post('posts')
  @ApiOperation({ summary: '게시글 작성' })
  createPost(@Body() dto: CreatePostDto, @Request() req: any) {
    const userId = req.user.user_id;

    return this.communityService.createPost(
      dto.title,
      dto.content,
      userId,
    );
  }

  /**
   * 게시글 목록 조회
   */
  @Get('posts')
  @ApiOperation({ summary: '게시글 목록 조회' })
  getAllPosts() {
    return this.communityService.getAllPosts();
  }

  /**
   * 게시글 상세 조회
   */
  @Get('posts/:id')
  @ApiOperation({ summary: '게시글 상세 조회' })
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.communityService.getPostById(id);
  }

  /**
   * 댓글 작성
   */
  @Post('comments')
  @ApiOperation({ summary: '댓글 작성' })
  createComment(@Body() dto: CreateCommentDto, @Request() req: any) {
    const userId = req.user.user_id;

    return this.communityService.createComment(
      dto.postId,
      dto.content,
      userId,
    );
  }

  /**
   * 게시글 좋아요 토글
   */
  @Post('posts/:id/like')
  @ApiOperation({ summary: '게시글 좋아요 토글' })
  toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user.user_id;
    return this.communityService.toggleLike(id, userId);
  }
}