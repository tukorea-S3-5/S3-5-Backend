import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
import { SessionExerciseDto } from './dto/session-exercise.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,

    @InjectRepository(ExerciseRecord)
    private readonly recordRepository: Repository<ExerciseRecord>,

    @InjectRepository(PregnancyInfo)
    private readonly pregnancyRepository: Repository<PregnancyInfo>,

    @InjectRepository(SymptomLog)
    private readonly symptomRepository: Repository<SymptomLog>,

    private readonly aiService: AiService,
  ) { }

  private calculateWeek(lmpInput: Date | string): number {
    const lmp = lmpInput instanceof Date ? lmpInput : new Date(lmpInput);
    const today = new Date();
    const diffDays =
      (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24);
    const week = Math.floor(diffDays / 7);

    return week < 0 ? 0 : week;
  }

  private calculateTrimester(week: number): number {
    if (week <= 13) return 1;
    if (week <= 27) return 2;
    return 3;
  }

  private getTrimesterNotice(trimester?: number): string {
    if (trimester === 1) {
      return '임신 초기에는 피로, 어지러움, 출혈 징후가 있으면 즉시 운동을 중단하고 저강도 운동 위주로 진행합니다.';
    }

    if (trimester === 2) {
      return '임신 중기에는 복부 압박과 바로 누운 자세를 피하고 균형이 불안정한 동작은 주의합니다.';
    }

    if (trimester === 3) {
      return '임신 후기에는 낙상 위험과 과도한 심박 상승을 피하고 운동 강도와 시간을 낮춥니다.';
    }

    return '임신 정보가 부족하므로 무리하지 않는 저강도 운동을 우선합니다.';
  }

  private buildReportRuleReasons(params: {
    trimester?: number;
    avgHeartRate: number | null;
    maxAllowedBpm?: number | null;
    symptoms: string[];
    conditions: string[];
  }): string[] {
    const reasons: string[] = [];

    if (params.trimester === 2) {
      reasons.push('2분기 기준 복부 압박과 바로 누운 자세를 주의');
    }

    if (params.trimester === 3) {
      reasons.push('3분기 기준 낙상 위험과 과도한 운동 강도를 주의');
    }

    if (
      params.avgHeartRate &&
      params.maxAllowedBpm &&
      params.avgHeartRate >= params.maxAllowedBpm
    ) {
      reasons.push('평균 심박수가 사용자 최대 허용 심박수에 근접');
    }

    if (params.symptoms.length) {
      reasons.push(`최근 증상(${params.symptoms.join(', ')}) 반영`);
    }

    if (params.conditions.length) {
      reasons.push(`기저 질환/주의 조건(${params.conditions.join(', ')}) 반영`);
    }

    return reasons;
  }

  /**
   * 특정 세션 리포트 생성
   * - 총 운동 시간
   * - 운동별 수행 시간
   */
  async generateSessionReport(
    userId: string,
    sessionId: number,
  ): Promise<SessionReportResponseDto> {

    /**
     * 1. 세션 존재 여부 확인
     */
    const session = await this.sessionRepository.findOne({
      where: {
        session_id: sessionId,
        user_id: userId,
        status: In(['COMPLETED', 'ABORTED']),
      },
    });

    if (!session) {
      throw new BadRequestException('해당 세션이 존재하지 않습니다.');
    }

    /**
     * 2. 해당 세션의 운동 기록 조회
     */
    const records = await this.recordRepository.find({
      where: { session_id: sessionId },
    });

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
      relations: ['conditions'],
    });

    const latestSymptom = await this.symptomRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    const week = pregnancy
      ? this.calculateWeek(pregnancy.last_menstrual_period)
      : undefined;
    const trimester =
      week !== undefined ? this.calculateTrimester(week) : undefined;
    const symptoms = latestSymptom?.symptoms ?? [];
    const conditions =
      pregnancy?.conditions?.map((condition) => condition.condition_code) ?? [];

    /**
     * 3. 총 운동 시간 계산
     */
    const totalDuration = records.reduce(
      (sum, record) => sum + (record.duration ?? 0),
      0,
    );

    /**
     * 4. 세션 심박수 집계
     */
    const validRecords = records.filter(
      (
        record,
      ): record is ExerciseRecord & {
        avg_heart_rate: number;
        max_heart_rate: number;
      } => record.avg_heart_rate !== null && record.max_heart_rate !== null,
    );

    const sessionAvgHeartRate = validRecords.length
      ? Math.round(
        validRecords.reduce((sum, r) => sum + r.avg_heart_rate, 0) /
        validRecords.length,
      )
      : null;

    const sessionMaxHeartRate = validRecords.length
      ? Math.max(...validRecords.map((r) => r.max_heart_rate))
      : null;

    /**
     * 5. 운동별 정리
     */
    const exerciseSummary: SessionExerciseDto[] = records.map((record) => ({
      exercise_name: record.exercise_name,
      duration: record.duration ?? null,
      avg_heart_rate: record.avg_heart_rate ?? null,
      max_heart_rate: record.max_heart_rate ?? null,
    }));

    /**
     * 6. AI 코멘트 생성 (Mock 또는 LLM)
     */
    const intensityLevel =
      sessionAvgHeartRate && sessionAvgHeartRate > 140
        ? 'HIGH'
        : sessionAvgHeartRate && sessionAvgHeartRate > 110
          ? 'MEDIUM'
          : 'LOW';

    const ruleReasons = this.buildReportRuleReasons({
      trimester,
      avgHeartRate: sessionAvgHeartRate,
      maxAllowedBpm: pregnancy?.max_allowed_bpm ?? null,
      symptoms,
      conditions,
    });

    const aiComment = await this.aiService.generateExerciseComment({
      week,
      trimester,
      bmi: pregnancy?.bmi ?? null,
      maxAllowedBpm: pregnancy?.max_allowed_bpm ?? null,
      conditions,
      totalDuration,
      status: session.status,
      symptoms,
      avgHeartRate: sessionAvgHeartRate ?? 0,
      intensityLevel,
      trimesterNotice: this.getTrimesterNotice(trimester),
      ruleReasons,
      exercises: records.map((r) => ({
        name: r.exercise_name,
        duration: r.duration ?? 0,
      })),
    });

    /**
     * 7. 반환
     */
    return {
      total_duration: totalDuration,
      avg_heart_rate: sessionAvgHeartRate,
      max_heart_rate: sessionMaxHeartRate,
      status: session.status,
      exercises: exerciseSummary,
      ai_comment: aiComment,
    };
  }
}
