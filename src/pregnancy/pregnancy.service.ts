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
   * 임신 정보 생성
   * @param userId JWT에서 추출한 사용자 ID
   * @param dto 프론트에서 전달된 임신 정보
   */
  async create(
    userId: string,
    dto: CreatePregnancyDto,
  ) {
    // 임신 시작일
    const startDate = new Date(dto.pregnancy_start_date);
    const today = new Date();

    // 임신 주차 계산
    const diffDays =
      (today.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    const week = Math.floor(diffDays / 7);

    // BMI 계산
    const heightMeter = dto.height / 100;
    const bmi =
      dto.pre_weight /
      (heightMeter * heightMeter);

    // 엔티티 생성
    const pregnancy = this.pregnancyRepository.create({
      user_id: userId,
      height: dto.height,
      pre_weight: dto.pre_weight,
      current_weight: dto.current_weight,
      pregnancy_start_date: startDate,
      week,
      trimester: Math.ceil(week / 13),
      bmi,
      // 다태아 여부는 초기에 모를 수 있으므로 null 허용
      is_multiple: dto.is_multiple ?? null,
      // 출산 예정일은 선택 값
      ...(dto.due_date && {
        due_date: new Date(dto.due_date),
      }),
    });

    return this.pregnancyRepository.save(pregnancy);
  }

  /**
   * 특정 사용자의 최신 임신 정보 조회
   */
  async findLatestByUser(userId: string) {
    const result =
      await this.pregnancyRepository.find({
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
  ) {
    const pregnancy =
      await this.pregnancyRepository.findOne({
        where: { user_id: userId },
        order: { pregnancy_id: 'DESC' },
      });

    // 수정할 데이터가 없으면 null 반환
    if (!pregnancy) return null;

    // 현재 체중 변경 시 BMI 재계산
    if (dto.current_weight !== undefined) {
      pregnancy.current_weight =
        dto.current_weight;

      const heightMeter =
        pregnancy.height / 100;
      pregnancy.bmi =
        pregnancy.pre_weight /
        (heightMeter * heightMeter);
    }

    // 출산 예정일 수정
    if (dto.due_date) {
      pregnancy.due_date =
        new Date(dto.due_date);
    }

    return this.pregnancyRepository.save(
      pregnancy,
    );
  }
}