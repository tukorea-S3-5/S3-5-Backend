import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  // UnauthorizedException, // 현재 코드에선 안 쓰여서 주석 처리
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';

// 검증된 유저 타입(비밀번호를 제외하고 반환해줌)
export interface ValidatedUser {
  user_id: string;
  email: string;
  name: string;
  birth_date: Date;
  created_at: Date;
  currentRefreshToken: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ================= 회원가입 =================
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, name, birth_date } = createUserDto;
    const user = this.userRepository.create({
      email,
      name,
      birth_date,
    });

    // 비밀번호 해싱
    await user.hashPassword(password);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      } else {
        console.error('회원가입 중 예상치 못한 DB 에러 발생:', error);
        throw new InternalServerErrorException('회원가입 처리에 실패했습니다.');
      }
    }
  }

  // ================= 유저 검증 (로그인 시) =================
  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) return null;

    // 비밀번호 비교
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  // ================= 로그인 =================
  async login(user: ValidatedUser) {
    const userId = user.user_id;
    const email = user.email;

    const tokens = await this.getTokens(userId, email);

    const userEntity = await this.userRepository.findOneBy({
      user_id: userId,
    });

    if (!userEntity) {
      // 이미 검증된 유저인데 DB에 없음
      throw new NotFoundException('로그인 과정에서 사용자를 찾을 수 없습니다.');
    }

    // RT 해싱 및 설정
    await userEntity.setRefreshToken(tokens.refreshToken);
    // 변경된 엔티티 저장
    await this.userRepository.save(userEntity);

    return tokens;
  }

  // ================= 로그아웃 =================
  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ user_id: userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 리프레시 토큰 제거
    user.removeRefreshToken();
    await this.userRepository.save(user);
  }

  // ================= 토큰 갱신 =================
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.currentRefreshToken') // RT 비교해야함
      .where('user.user_id = :userId', { userId })
      .getOne();

    // 유저가 없거나 리프레시 토큰 존재x -> 403 에러코드 액세스 거부됨
    if (!user || !user.currentRefreshToken)
      throw new ForbiddenException('Access Denied');

    // refreshToken 비교
    const isMatch = await user.compareRefreshToken(refreshToken);
    // 리프레시 토큰이 일치하지 않음 -> 403 에러코드 액세스 거부됨
    if (!isMatch) throw new ForbiddenException('Access Denied');

    // 새 토큰 발급 (RT Rotation)
    const tokens = await this.getTokens(user.user_id, user.email);

    // 새 RT 설정
    await user.setRefreshToken(tokens.refreshToken);
    await this.userRepository.save(user);

    return tokens;
  }

  // ================= 액세스, 리프레시 토큰 생성 =================
  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: Number(
          this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_TIME'),
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: Number(
          this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_TIME'),
        ),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
