import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../user/user.entity';
import { HeartRateRecord } from './heart-rate-record.entity';

@Injectable()
export class HeartRateService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(HeartRateRecord)
    private readonly heartRateRepository: Repository<HeartRateRecord>,
  ) {}

  /**
   * 안정 심박수 업데이트
   */
  async updateRestingHeartRate(
    userId: string,
    restingHeartRate: number,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('사용자가 존재하지 않습니다.');
    }

    user.restingHeartRate = restingHeartRate;
    user.restingHeartRateUpdatedAt = new Date();

    await this.userRepository.save(user);

    return {
      message: '안정 심박수가 저장되었습니다.',
      restingHeartRate: user.restingHeartRate,
    };
  }

  /**
   * 실시간 심박 위험 판단
   */
  async checkHeartRate(
    userId: string,
    currentHeartRate: number,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('사용자가 존재하지 않습니다.');
    }

    if (!user.birth_date) {
      throw new BadRequestException('생년월일 정보가 없습니다.');
    }

    const birthDate = new Date(user.birth_date);
    const age = this.calculateAge(birthDate);
    const maxHR = 220 - age;

    let status: 'normal' | 'warning' | 'danger' = 'normal';

    if (currentHeartRate >= maxHR) {
      status = 'danger';
    } else if (
      user.restingHeartRate !== null &&
      currentHeartRate >= user.restingHeartRate + 40
    ) {
      status = 'warning';
    }

    /**
     * 심박 기록 저장
     */
    await this.heartRateRepository.save({
      user_id: userId,
      bpm: currentHeartRate,
    });

    return {
      status,
      maxHR,
      restingHR: user.restingHeartRate,
    };
  }

  /**
   * 주간 심박 통계
   */
  async getWeeklyHeartRate(userId: string) {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 7);
  
    const records = await this.heartRateRepository.find({
      where: {
        user_id: userId,
        created_at: Between(start, now),
      },
      order: {
        created_at: 'ASC',
      },
    });
  
    if (!records.length) {
      return {
        average: null,
        max: null,
        count: 0,
        records: [],
      };
    }
  
    const avg = Math.round(
      records.reduce((sum, r) => sum + r.bpm, 0) / records.length,
    );
  
    const max = Math.max(...records.map(r => r.bpm));
  
    return {
      average: avg,
      max,
      count: records.length,
      records: records.map(r => ({
        bpm: r.bpm,
        created_at: r.created_at,
      })),
    };
  }

  /**
   * 나이 계산
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}