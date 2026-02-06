import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      // 헤더에서 Bearer 토큰 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Refresh Token이 만료되었는지 검사
      ignoreExpiration: false,
      // Refresh Token 전용 비밀키 사용
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      // true로 설정해야 validate 메서드에서 Request 객체를 받을 수 있음
      passReqToCallback: true,
    });
  }

  // 토큰 서명이 유효하면 이 메서드가 실행됩니다.
  validate(req: Request, payload: JwtPayload) {
    // 헤더에서 Authorization 값을 가져옵니다.
    const authHeader = req.get('authorization');
    if (!authHeader) throw new ForbiddenException('Token not found');

    // "Bearer " 부분을 제거하고 순수한 토큰 문자열만 추출합니다.
    const refreshToken = authHeader.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }

    // 컨트롤러의 req.user에 들어갈 최종 데이터를 리턴합니다.
    // 기존 Payload 정보에 날것의 refreshToken을 추가해서 넘겨줍니다.
    return { ...payload, refreshToken };
  }
}
