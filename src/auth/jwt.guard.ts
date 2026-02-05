import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Reflector를 주입(메타데이터를 읽는 도구)
  constructor(private reflector: Reflector) {
    super();
  }

  // 가드가 요청을 허용할지 말지 결정하는 메서드
  canActivate(context: ExecutionContext) {
    // 현재 요청하려는 핸들러(메서드)나 컨트롤러(클래스)에 @Public 데코레이터가 붙어있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // @Public이 붙어있으면 (isPublic이 true면) 부모 클래스의 검사를 건너뛰고 통과
    if (isPublic) {
      return true;
    }

    // 안 붙어있으면 원래대로 JWT 토큰 검사를 진행
    return super.canActivate(context);
  }
}
