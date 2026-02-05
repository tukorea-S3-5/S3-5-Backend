import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';

@Injectable()
export class PregnancyService {
  constructor(
    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,
  ) {}

  /**
   * 임신 정보 등록
   * 1. BMI 계산
   * 2. 임신 주차 계산
   * 3. DB 저장
   */
  async create(dto: CreatePregnancyDto): Promise<PregnancyInfo> {
    const startDate = new Date(dto.pregnancy_start_date);

    const today = new Date();
    const diffDays =
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const week = Math.floor(diffDays / 7);

    const heightMeter = dto.height / 100;
    const bmi = dto.pre_weight / (heightMeter * heightMeter);

    const pregnancy = this.pregnancyRepository.create({
      user_id: dto.user_id,
      height: dto.height,
      pre_weight: dto.pre_weight,
      current_weight: dto.current_weight,
      pregnancy_start_date: startDate,
      week,
      trimester: Math.ceil(week / 13),
      bmi,
      is_multiple: dto.is_multiple ?? null,

      ...(dto.due_date && { due_date: new Date(dto.due_date) }),
    });

    return this.pregnancyRepository.save(pregnancy);
  }

  /**
   * 특정 사용자의 임신 정보 조회
   */
  async findLatestByUser(userId: string): Promise<PregnancyInfo | null> {
    const result = await this.pregnancyRepository.find({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
      take: 1,
    });

    return result[0] ?? null;
  }

  /**
   * 특정 사용자의 최신 임신 정보 수정
   */
  async updateLatestByUser(
    userId: string,
    dto: UpdatePregnancyDto,
  ): Promise<PregnancyInfo | null> {
    // 1. 최신 임신 정보 조회
    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) {
      return null;
    }

    // 2. 현재 체중 수정 + BMI 재계산
    if (dto.current_weight !== undefined) {
      pregnancy.current_weight = dto.current_weight;

      const heightMeter = pregnancy.height / 100;
      pregnancy.bmi = pregnancy.pre_weight / (heightMeter * heightMeter);
    }

    // 3. 출산 예정일 수정
    if (dto.due_date) {
      pregnancy.due_date = new Date(dto.due_date);
    }

    // 다태아 여부 수정
    if (dto.is_multiple !== undefined) {
      pregnancy.is_multiple = dto.is_multiple;
    }

    // 4. 저장 (updated_at 자동 변경)
    return this.pregnancyRepository.save(pregnancy);
  }
}
