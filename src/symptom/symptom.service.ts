import { Injectable } from '@nestjs/common';
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
   * 증상 여러 개 저장
   */
  async createSymptoms(userId: string, symptoms: string[]) {
    const symptomEntities = symptoms.map((symptom) =>
      this.symptomRepository.create({
        user_id: userId,
        symptom_name: symptom,
      }),
    );

    return this.symptomRepository.save(symptomEntities);
  }

  /**
   * 증상 이력 조회
   */
  async getHistory(userId: string) {
    return this.symptomRepository.find({
      where: { user_id: userId },
      order: { recorded_at: 'DESC' },
    });
  }
}