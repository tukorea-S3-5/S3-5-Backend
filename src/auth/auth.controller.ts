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
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import type {
  RequestWithRefreshUser,
  RequestWithUser,
  RequestWithValidatedUser,
} from './interfaces/auth.interface';

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
      if (error instanceof BadRequestException) {
        // 중복 유저 에러라면 400 Bad Request로 변환
        throw new BadRequestException(error.message);
      }

      // 그 외 예상치 못한 모든 에러 500 Internal Server Error로 처리
      console.error('SignUp Error:', error);
      throw new InternalServerErrorException('회원가입 처리에 실패했습니다.');
    }
  }

  // ================= 로그인 API =================
  // 로컬 가드가 Body의 내용을 보고, 인증에 성공하면 그 결과물(유저 정보)을 req.user에 전달 후 로그인 로직 처리."
  @ApiOperation({ summary: '로그인' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: '로그인 성공 (토큰 발급)' })
  @ApiResponse({ status: 401, description: '로그인 실패 (아이디/비번 불일치)' })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: RequestWithValidatedUser,
    @Body() loginDto: LoginDto,
  ) {
    console.log(loginDto, req.user);
    return this.authService.login(req.user);
  }

  // ================= 리프레시 토큰 갱신 API =================
  @ApiBearerAuth('access-token')
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '토큰 갱신',
    description: '새로운 Access/Refresh Token을 발급',
  })
  async refreshTokens(@Request() req: RequestWithRefreshUser) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  // ================= 로그아웃 API =================
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestWithUser) {
    const userId = req.user.user_id;
    console.log('로그아웃 요청 사용자 ID:', userId);

    await this.authService.logout(userId);
    return { message: '로그아웃 성공' };
  }
}
