import { Request } from 'express';
import { ValidatedUser } from '../auth.service';
import { User } from 'src/user/user.entity';

export interface Payload {
  email: string;
  sub: string; // user_id
}

// 토큰 페이로드 타입 (Access/Refresh 공통)
export interface JwtPayload {
  sub: string; // user_id
  email: string;
  iat?: number;
  exp?: number;
}

// Refresh Token 전략이 반환하는 유저 타입
export interface UserWithRefreshToken extends JwtPayload {
  refreshToken: string;
}

// 컨트롤러에서 사용할 Request 타입 확장 (Access Token용)
// JwtStrategy의 validate가 반환하는 타입
export interface RequestWithUser extends Request {
  user: User;
}

// 컨트롤러에서 사용할 Request 타입 확장 (Refresh Token용)
export interface RequestWithRefreshUser extends Request {
  user: UserWithRefreshToken;
}

// LocalGuard를 통과한 직후의 요청 타입
export interface RequestWithValidatedUser extends Request {
  user: ValidatedUser;
}
