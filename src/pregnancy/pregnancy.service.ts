import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class PregnancyService {
  constructor(
    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,

    @InjectRepository(PregnancyWeightLog)
    private readonly weightRepository: Repository<PregnancyWeightLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ================= 나이 계산 함수 =================
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  // ================= 최대 허용 심박수 계산 함수 =================
  private calculateMaxBpm(
    age: number,
    fitnessLevel: 'ACTIVE' | 'SEDENTARY',
  ): number {
    if (age < 20) {
      return fitnessLevel === 'ACTIVE' ? 151 : 125;
    } else if (age >= 20 && age <= 29) {
      return fitnessLevel === 'ACTIVE' ? 161 : 145;
    } else if (age >= 30 && age <= 39) {
      return fitnessLevel === 'ACTIVE' ? 157 : 145;
    } else {
      // 40세 이상 (운동 여부 무관하게 일괄 141 이상 진동)
      return 141;
    }
  }

  /**
   * 임신 정보 생성
   * - 임신 상태 정보만 저장
   */
  async create(userId: string, dto: CreatePregnancyDto) {
    // 유저 생년월일 가져오기 (심박수 계산용)
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const age = this.calculateAge(new Date(user.birth_date));
    const maxBpm = this.calculateMaxBpm(age, dto.fitness_level);

    // 날짜 및 주수 계산
    const lmp = new Date(dto.last_menstrual_period);
    const today = new Date();

    const diffDays = (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24);
    const week = Math.floor(diffDays / 7);

    // 출산 예정일(Due Date) 자동 계산 (LMP + 280일)
    // 프론트에서 안 보내줬다면 백엔드가 직접 계산
    const calculatedDueDate = new Date(
      lmp.getTime() + 280 * 24 * 60 * 60 * 1000,
    );
    const finalDueDate = calculatedDueDate;

    // BMI 계산
    const heightMeter = dto.height / 100;
    const bmi = dto.pre_weight / (heightMeter * heightMeter);

    // 엔티티 생성 및 저장
    const pregnancy = this.pregnancyRepository.create({
      user_id: userId,
      last_menstrual_period: lmp,
      pregnancy_start_date: lmp,
      week,
      trimester: Math.ceil(week / 13),
      due_date: finalDueDate,
      height: dto.height,
      pre_weight: dto.pre_weight,
      bmi,
      is_multiple: dto.is_multiple ?? null,
      fitness_level: dto.fitness_level,
      contraindication: dto.contraindication,
      max_allowed_bpm: maxBpm,
    });

    return this.pregnancyRepository.save(pregnancy);
  }

  /**
   * 내 최신 임신 정보 조회 + 체중 요약
   */
  async findLatestByUser(userId: string) {
    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) return null;

    /**
     * 최신 체중 로그 조회
     */
    const latestWeightLog = await this.weightRepository.findOne({
      where: { pregnancy_id: pregnancy.pregnancy_id },
      order: { week: 'DESC' },
    });

    const startWeight = pregnancy.pre_weight;
    const currentWeight = latestWeightLog
      ? latestWeightLog.weight
      : startWeight;

    const totalGain = Number((currentWeight - startWeight).toFixed(1));

    /**
     * 프론트용 응답 형태
     */
    return {
      pregnancy_id: pregnancy.pregnancy_id,
      week: pregnancy.week,
      trimester: pregnancy.trimester,

      pre_weight: startWeight,
      current_weight: currentWeight,
      total_gain: totalGain,

      due_date: pregnancy.due_date,
      is_multiple: pregnancy.is_multiple,
      max_allowed_bpm: pregnancy.max_allowed_bpm,
    };
  }

  /**
   * 내 최신 임신 정보 수정
   * - pre_weight 수정 허용
   */
  async updateLatestByUser(userId: string, dto: UpdatePregnancyDto) {
    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) return null;

    // 임신 전 체중 수정 (허용)
    if (dto.pre_weight !== undefined) {
      pregnancy.pre_weight = dto.pre_weight;

      // BMI 재계산
      const heightMeter = pregnancy.height / 100;
      pregnancy.bmi = dto.pre_weight / (heightMeter * heightMeter);
    }

    if (dto.is_multiple !== undefined) {
      pregnancy.is_multiple = dto.is_multiple;
    }

    if (dto.due_date) {
      pregnancy.due_date = new Date(dto.due_date);
    }

    return this.pregnancyRepository.save(pregnancy);
  }
}
