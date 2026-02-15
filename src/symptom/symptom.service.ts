import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SymptomLog } from '../entities/symptom-log.entity';

@Injectable()
export class SymptomService {
  constructor(
    @InjectRepository(SymptomLog)
    private readonly symptomRepository: Repository<SymptomLog>,
  ) {}

  /**
   * 증상 세트 저장
   *
   * - 사용자가 한 번에 선택한 증상들을
   *   JSON 배열 형태로 1 row에 저장
   *
   * 예:
   * ["요통", "피로감"]
   */
  async createSymptoms(userId: string, symptoms: string[]) {
    if (!symptoms || symptoms.length === 0) {
      throw new BadRequestException('최소 1개 이상의 증상을 선택해야 합니다.');
    }

    const symptomLog = this.symptomRepository.create({
      user_id: userId,
      symptoms, // ← JSON 배열 그대로 저장
    });

    return this.symptomRepository.save(symptomLog);
  }

  /**
   * 증상 이력 조회
   *
   * - 과거에 입력했던 세트들 확인
   * - 최신 순 정렬
   */
  async getHistory(userId: string) {
    return this.symptomRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 최신 증상 세트 조회 (추천용)
   */
  async getLatestSymptoms(userId: string) {
    const latest = await this.symptomRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    if (!latest) {
      throw new BadRequestException('입력된 증상이 없습니다.');
    }

    return latest.symptoms;
  }
}