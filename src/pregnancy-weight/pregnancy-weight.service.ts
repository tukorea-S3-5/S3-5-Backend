import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';
import { UpdateWeightLogDto } from './dto/update-weight-log.dto';

@Injectable()
export class PregnancyWeightService {
  constructor(
    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,

    @InjectRepository(PregnancyWeightLog)
    private readonly weightRepository: Repository<PregnancyWeightLog>,
  ) {}

  /**
   * 임신 주차별 체중 기록 등록
   * - 한 주차당 하나만 허용
   */
  async addWeight(
    userId: string,
    dto: CreateWeightLogDto,
  ) {
    const pregnancy = await this.getLatestPregnancy(userId);

    const exists = await this.weightRepository.findOne({
      where: {
        pregnancy_id: pregnancy.pregnancy_id,
        week: dto.week,
      },
    });

    if (exists) {
      throw new BadRequestException(
        '해당 주차의 체중 기록이 이미 존재합니다.',
      );
    }

    const log = this.weightRepository.create({
      pregnancy_id: pregnancy.pregnancy_id,
      week: dto.week,
      weight: dto.weight,
    });

    return this.weightRepository.save(log);
  }

  /**
   * 임신 주차별 체중 기록 수정
   */
  async updateWeight(
    userId: string,
    week: number,
    dto: UpdateWeightLogDto,
  ) {
    const pregnancy = await this.getLatestPregnancy(userId);

    const log = await this.weightRepository.findOne({
      where: {
        pregnancy_id: pregnancy.pregnancy_id,
        week,
      },
    });

    if (!log) {
      throw new BadRequestException(
        '해당 주차의 체중 기록이 없습니다.',
      );
    }

    log.weight = dto.weight;
    return this.weightRepository.save(log);
  }

  /**
   * 임신 주차별 체중 기록 + 체중 증가 요약 조회
   */
  async getMyWeightLogs(userId: string) {
    const pregnancy = await this.getLatestPregnancy(userId);

    const logs = await this.weightRepository.find({
      where: { pregnancy_id: pregnancy.pregnancy_id },
      order: { week: 'ASC' },
    });

    const startWeight = pregnancy.pre_weight;
    const currentWeight =
      logs.length > 0
        ? logs[logs.length - 1].weight
        : startWeight;

    const totalGain = Number(
      (currentWeight - startWeight).toFixed(1),
    );

    return {
      summary: {
        start_weight: startWeight,
        current_weight: currentWeight,
        total_gain: totalGain,
      },
      logs,
    };
  }

  /**
   * 최신 임신 정보 공통 조회
   */
  private async getLatestPregnancy(userId: string) {
    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) {
      throw new BadRequestException('임신 정보가 없습니다.');
    }

    return pregnancy;
  }
}