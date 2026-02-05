import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

// 커스텀 에러 클래스 정의
export class UserAlreadyExistsError extends Error {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    // 입력받은 비밀번호 암호화
    const hashedPassword = await this.createPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new UserAlreadyExistsError(
          `이미 존재하는 이메일입니다: ${newUser.email}`,
        );
      } else {
        console.error('회원가입 중 예상치 못한 DB 에러 발생:', error);
        throw error;
      }
    }
  }

  // 비밀번호 암호화
  async createPassword(plainPassword: string): Promise<string> {
    const hashedPassword: string = await bcrypt.hash(plainPassword, 12);
    return hashedPassword;
  }

  // 유저 검증 (아이디/비번 맞는지 확인)
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    // 이메일로 유저 찾기
    const user: User | null = await this.userService.findByEmail(email);

    // 유저가 있고, bcrypt.compare 사용해서 비밀번호가 일치하는지 확인
    if (user && (await bcrypt.compare(password, user.password))) {
      // 보안을 위해 비밀번호 정보는 빼고 나머지 정보만 리턴
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  // 로그인(토큰 발급)
  // 검증이 완료된 유저 객체를 받아서 토큰을 만듦
  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.user_id };

    return {
      // jwtService.sign()이 토큰을 생성하는 함수임
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
