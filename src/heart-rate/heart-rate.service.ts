import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class HeartRateService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

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

        return {
            status,
            maxHR,
            restingHR: user.restingHeartRate,
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