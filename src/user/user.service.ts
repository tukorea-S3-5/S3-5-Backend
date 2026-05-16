import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 이메일로 유저를 찾는 메서드
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // ================= 내 정보 조회 =================
  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('사용자가 존재하지 않습니다.');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      birth_date: user.birth_date,
      profileImage: user.profileImage,
      created_at: user.created_at,
    };
  }

  // ================= 내 정보 수정 =================
  async updateMe(
    userId: string,
    name?: string,
    profileImage?: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('사용자가 존재하지 않습니다.');
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await this.userRepository.save(user);

    return {
      message: '사용자 정보가 수정되었습니다.',
      name: user.name,
      profileImage: user.profileImage,
    };
  }
}