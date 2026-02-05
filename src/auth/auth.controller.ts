import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, UserAlreadyExistsError } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================= 회원가입 API =================
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: CreateUserDto })
  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED) // 201 코드 반환
  @ApiCreatedResponse({ description: '회원가입 성공' })
  @ApiBadRequestResponse({ description: '이미 존재하는 이메일인 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 내부 오류' })
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.signUp(createUserDto);
      return { message: '회원가입이 성공적으로 완료되었습니다.' };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        // 중복 유저 에러라면 400 Bad Request로 변환
        throw new BadRequestException(error.message);
      }

      // 그 외 예상치 못한 모든 에러 500 Internal Server Error로 처리
      console.error('SignUp Error:', error);
      throw new InternalServerErrorException('회원가입 처리에 실패했습니다.');
    }
  }

  // ================= 로그인 API =================
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공 (토큰 발급)' })
  @ApiResponse({ status: 401, description: '로그인 실패 (아이디/비번 불일치)' })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: ExpressRequest & { user: User }) {
    console.log('인증 통과한 유저:', req.user); // 확인용 로그
    // login 함수 호출해서 토큰을 발급받아 리턴
    return this.authService.login(req.user);
  }
}
