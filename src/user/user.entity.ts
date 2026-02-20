import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'varchar', length: 300, select: false })
  currentRefreshToken: string | null;

  // 비밀번호 해싱
  async hashPassword(plainTextPassword: string): Promise<void> {
    this.password = await bcrypt.hash(plainTextPassword, 10);
  }

  // 비밀번호 비교 (로그인 시 호출)
  async comparePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.password);
  }

  // 리프레시 토큰 해싱 및 설정
  async setRefreshToken(refreshToken: string): Promise<void> {
    this.currentRefreshToken = await bcrypt.hash(refreshToken, 10);
  }

  // 리프레시 토큰 비교 (토큰 갱신 시 호출)
  async compareRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.currentRefreshToken) return false;
    return await bcrypt.compare(refreshToken, this.currentRefreshToken);
  }

  // 로그아웃용 RT 제거
  removeRefreshToken() {
    this.currentRefreshToken = null;
  }
}
