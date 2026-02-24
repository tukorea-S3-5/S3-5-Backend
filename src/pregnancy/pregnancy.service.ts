import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { PregnancyCondition } from '../entities/pregnancy-condition.entity';
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

    @InjectRepository(PregnancyCondition)
    private readonly pregnancyConditionRepository: Repository<PregnancyCondition>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 현재 나이 계산
   */
  private calculateAge(birthInput: Date | string): number {
    const birthDate =
      birthInput instanceof Date
        ? birthInput
        : new Date(birthInput);

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

  /**
   * 최대 허용 심박수 계산
   */
  private calculateMaxBpm(
    age: number,
    fitnessLevel: 'ACTIVE' | 'SEDENTARY',
    bmi: number,
  ): number {

    let maxBpm = 0;

    if (age < 20) {
      maxBpm = fitnessLevel === 'ACTIVE' ? 151 : 125;
    } else if (age <= 29) {
      maxBpm = fitnessLevel === 'ACTIVE' ? 161 : 145;
    } else if (age <= 39) {
      maxBpm = fitnessLevel === 'ACTIVE' ? 157 : 145;
    } else {
      maxBpm = 141;
    }

    // 과체중 안전 마진
    if (bmi >= 25) {
      maxBpm -= 10;
    }

    return maxBpm;
  }

  /**
   * 임신 주차 계산 (동적)
   */
  private calculateWeek(lmpInput: Date | string): number {
    const lmp =
      lmpInput instanceof Date
        ? lmpInput
        : new Date(lmpInput);

    const today = new Date();

    const diffDays =
      (today.getTime() - lmp.getTime()) /
      (1000 * 60 * 60 * 24);

    // 미래 날짜 방지
    const week = Math.floor(diffDays / 7);

    return week < 0 ? 0 : week;
  }

  /**
   * 분기 계산
   */
  private calculateTrimester(week: number): number {
    if (week <= 13) return 1;
    if (week <= 26) return 2;
    return 3;
  }

  /**
   * 임신 정보 생성
   * week / trimester는 저장하지 않음
   */
  async create(userId: string, dto: CreatePregnancyDto) {

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const heightMeter = dto.height / 100;
    const bmi = dto.pre_weight / (heightMeter * heightMeter);

    const age = this.calculateAge(user.birth_date);

    const maxBpm =
      this.calculateMaxBpm(
        age,
        dto.fitness_level,
        bmi,
      );

    const lmp = new Date(dto.last_menstrual_period);

    const dueDate = new Date(
      lmp.getTime() + 280 * 24 * 60 * 60 * 1000,
    );

    const pregnancy = await this.pregnancyRepository.save(
      this.pregnancyRepository.create({
        user_id: userId,
        last_menstrual_period: lmp,
        pregnancy_start_date: lmp,
        due_date: dueDate,
        height: dto.height,
        pre_weight: dto.pre_weight,
        bmi,
        is_multiple: dto.is_multiple ?? null,
        fitness_level: dto.fitness_level,
        max_allowed_bpm: maxBpm,
      }),
    );

    // 질환 저장
    if (dto.conditions?.length) {
      for (const code of dto.conditions) {
        await this.pregnancyConditionRepository.save(
          this.pregnancyConditionRepository.create({
            pregnancy_id: pregnancy.pregnancy_id,
            condition_code: code,
          }),
        );
      }
    }

    return pregnancy;
  }

  /**
   * 최신 임신 정보 조회
   * 모든 시간 기반 값은 동적 계산
   */
  async findLatestByUser(userId: string) {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
      relations: ['conditions'],
    });

    if (!pregnancy) return null;

    const week =
      this.calculateWeek(
        pregnancy.last_menstrual_period,
      );

    const trimester =
      this.calculateTrimester(week);

    // 현재 나이 재계산
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    const age =
      user ? this.calculateAge(user.birth_date) : 0;

    // max bpm도 동적으로 재계산
    const recalculatedMaxBpm =
      this.calculateMaxBpm(
        age,
        pregnancy.fitness_level,
        pregnancy.bmi,
      );

    const latestWeightLog =
      await this.weightRepository.findOne({
        where: { pregnancy_id: pregnancy.pregnancy_id },
        order: { week: 'DESC' },
      });

    const startWeight = pregnancy.pre_weight;

    const currentWeight =
      latestWeightLog?.weight ?? startWeight;

    const totalGain =
      Number((currentWeight - startWeight).toFixed(1));

    return {
      pregnancy_id: pregnancy.pregnancy_id,
      week,
      trimester,
      pre_weight: startWeight,
      current_weight: currentWeight,
      total_gain: totalGain,
      due_date: pregnancy.due_date,
      is_multiple: pregnancy.is_multiple,
      max_allowed_bpm: recalculatedMaxBpm,
      conditions:
        pregnancy.conditions?.map(
          c => c.condition_code,
        ) ?? [],
    };
  }

  /**
   * 최신 임신 정보 수정
   */
  async updateLatestByUser(
    userId: string,
    dto: UpdatePregnancyDto,
  ) {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
      relations: ['conditions'],
    });

    if (!pregnancy) return null;

    if (dto.pre_weight !== undefined) {
      pregnancy.pre_weight = dto.pre_weight;

      const heightMeter =
        pregnancy.height / 100;

      pregnancy.bmi =
        dto.pre_weight /
        (heightMeter * heightMeter);
    }

    if (dto.is_multiple !== undefined) {
      pregnancy.is_multiple =
        dto.is_multiple;
    }

    if (dto.due_date) {
      pregnancy.due_date =
        new Date(dto.due_date);
    }

    return this.pregnancyRepository.save(
      pregnancy,
    );
  }
}