import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SymptomLog } from '../entities/symptom-log.entity';
import { SymptomType } from 'src/common/enums/symptom.enum';

@Injectable()
export class SymptomService {
  constructor(
    @InjectRepository(SymptomLog)
    private readonly symptomRepository: Repository<SymptomLog>,
  ) {}

  /**
   * 증상 세트 저장
   * - 0개도 허용 (해당 없음)
   * - null이면 빈 배열로 정규화
   */
  async createSymptoms(
    userId: string,
    symptoms: SymptomType[] = [],
  ) {

    const normalizedSymptoms = symptoms ?? [];

    const symptomLog = this.symptomRepository.create({
      user_id: userId,
      symptoms: normalizedSymptoms,
    });

    return this.symptomRepository.save(symptomLog);
  }

  /**
   * 증상 이력 조회
   * - 최신 순 정렬
   */
  async getHistory(userId: string) {
    return this.symptomRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 최신 증상 세트 조회
   * - 한 번도 입력 안 했으면 빈 배열 반환
   */
  async getLatestSymptoms(userId: string) {

    const latest = await this.symptomRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    if (!latest) {
      return [];
    }

    return latest.symptoms ?? [];
  }
}