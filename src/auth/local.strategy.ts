///
/// 최초 로그인을 담당
///

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, ValidatedUser } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<ValidatedUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // 검증 실패 시 에러 (401 Unauthorized)
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    // 성공하면 이 user 객체가 컨트롤러의 @Request() req.user 에 들어감
    return user;
  }
}
