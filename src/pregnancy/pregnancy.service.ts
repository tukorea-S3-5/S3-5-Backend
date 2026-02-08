import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';

@Injectable()
export class PregnancyService {
  constructor(
    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,

    @InjectRepository(PregnancyWeightLog)
    private readonly weightRepository: Repository<PregnancyWeightLog>,
  ) { }

  /**
   * 임신 정보 생성
   * - 임신 상태 정보만 저장
   */
  async create(userId: string, dto: CreatePregnancyDto) {
    const lmp = new Date(dto.last_menstrual_period);
    const today = new Date();

    const diffDays =
      (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24);
    const week = Math.floor(diffDays / 7);

    const heightMeter = dto.height / 100;
    const bmi = dto.pre_weight / (heightMeter * heightMeter);

    const pregnancy = this.pregnancyRepository.create({
      user_id: userId,
      last_menstrual_period: lmp,
      pregnancy_start_date: lmp,
      week,
      trimester: Math.ceil(week / 13),
      height: dto.height,
      pre_weight: dto.pre_weight,
      bmi,
      is_multiple: dto.is_multiple ?? null,
      ...(dto.due_date && {
        due_date: new Date(dto.due_date),
      }),
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

    const totalGain = Number(
      (currentWeight - startWeight).toFixed(1),
    );

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
    };
  }

  /**
   * 내 최신 임신 정보 수정
   * - pre_weight 수정 허용
   */
  async updateLatestByUser(
    userId: string,
    dto: UpdatePregnancyDto,
  ) {
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
      pregnancy.bmi =
        dto.pre_weight / (heightMeter * heightMeter);
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