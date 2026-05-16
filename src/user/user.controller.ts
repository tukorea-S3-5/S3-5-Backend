import {
  Body, Controller, HttpCode, HttpStatus, Post, Get, Put, Req, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FindEmailDto } from './dto/find-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ================= 이메일 중복 확인 API =================
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/check-email-exists')
  @ApiOperation({ summary: '이메일 중복 확인' })
  async checkEmailExists(@Body() findEmailDto: FindEmailDto) {
    const { email } = findEmailDto;
    const user = await this.userService.findByEmail(email);

    return {
      exists: !!user, // 이메일이 있으면 true(중복됨), 없으면 false(사용 가능)
      email: email,
    };
  }
  // ================= 내 정보 조회 =================

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회' })
  async getMe(@Req() req) {
    return this.userService.getMe(req.user.user_id);
  }

  // ================= 내 정보 수정 =================

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Put('/me')
  @ApiOperation({ summary: '내 정보 수정' })

  async updateMe(
    @Req() req,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateMe(
      req.user.user_id,
      dto.name,
      dto.profileImage,
    );
  }
}
