///
/// 로그인 이후의 모든 API 요청을 검사
///

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

// 토큰 Payload의 모양을 정의
export interface Payload {
  email: string;
  sub: string; // user_id
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {
    super({
      // 헤더에서 토큰 추출, 비밀키로 검증하는 건 부모 클래스가 다 알아서 함
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: Payload) {
    // 페이로드에 있는 이메일로 DB에서 유저가 진짜 있는지 확인
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      // 토큰은 멀쩡한데 DB에 유저가 없는 경우 (예: 탈퇴한 회원)
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // 여기서 리턴한 user 객체가 컨트롤러의 @Request() req.user에 들어감
    return user;
  }
}
