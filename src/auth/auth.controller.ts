import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import type {
  RequestWithRefreshUser,
  RequestWithUser,
  RequestWithValidatedUser,
} from './interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';

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
    await this.authService.signUp(createUserDto);
    return { message: '회원가입이 성공적으로 완료되었습니다.' };
  }

  // ================= 로그인 API =================
  // 로컬 가드가 Body의 내용을 보고, 인증에 성공하면 그 결과물(유저 정보)을 req.user에 전달 후 로그인 로직 처리
  @ApiOperation({ summary: '로그인' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: '로그인 성공 (토큰 발급)' })
  @ApiResponse({ status: 401, description: '로그인 실패 (아이디/비번 불일치)' })
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() LoginDto: LoginDto,
    @Request() req: RequestWithValidatedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(req.user);

    // refreshToken을 httpOnly 쿠키로 저장
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // 배포(https)면 true
      sameSite: 'lax', // 배포(https)면 'none'
      path: '/', // 배포(https)면 '/auth/refresh'
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log(req.user);
    return { accessToken: tokens.accessToken };
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
  async refreshTokens(
    @Request() req: RequestWithRefreshUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;

    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // 배포(https)면 true
      sameSite: 'lax', // 배포(https)면 'none'
      path: '/', // 배포(https)면 '/auth/refresh'
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { accessToken: tokens.accessToken };
  }

  // ================= 로그아웃 API =================
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.user_id;
    console.log('로그아웃 요청 사용자 ID:', userId);

    await this.authService.logout(userId);
    res.clearCookie('refreshToken', { path: '/' }); // 배포(https)면 '/auth/refresh'
    return { message: '로그아웃 성공' };
  }
}
