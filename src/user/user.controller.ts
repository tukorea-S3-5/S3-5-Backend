import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { FindEmailDto } from './dto/find-email.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
