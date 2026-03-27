import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { PregnancyCondition } from '../entities/pregnancy-condition.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { User } from '../user/user.entity';

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
  ) { }

  /**
 * 분기별 운동 가이드라인 상수 (ACOG 기준)
 */
  private readonly GUIDELINES = {
    1: {
      title: '1분기 운동 가이드라인 (ACOG)',
      items: [
        '심박수 급상승 유발 운동 피하기',
        '복부 압박 동작 최소화',
        '어지러움·출혈 발생 시 즉시 중단',
        '충분한 휴식과 수분 섭취 병행',
      ],
    },
    2: {
      title: '2분기 운동 가이드라인 (ACOG)',
      items: [
        '중간 강도 유산소 운동 가능',
        '복부 직접 압박 동작 피하기',
        '균형 유지 어려운 동작 주의',
        '규칙적인 스트레칭 병행',
      ],
    },
    3: {
      title: '3분기 운동 가이드라인 (ACOG)',
      items: [
        '운동 강도와 시간을 점진적으로 줄이기',
        '낙상 위험이 높은 운동 피하기',
        '골반저근 운동(케겔) 지속',
        '조기 진통 징후 시 즉시 운동 중단',
      ],
    },
  };

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
    if (week <= 27) return 2;
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
      bmi: pregnancy.bmi,
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

  /**
 * 분기별 운동 가이드라인 조회
 */
  async getGuideline(userId: string) {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) {
      throw new NotFoundException('임신 정보가 없습니다.');
    }

    const week =
      this.calculateWeek(
        pregnancy.last_menstrual_period,
      );

    const trimester =
      this.calculateTrimester(week);

    const guideline =
      this.GUIDELINES[trimester];

    return {
      week,
      trimester,
      title: guideline.title,
      guidelines: guideline.items,
    };
  }

  /**
   * 분기별 흔한 증상
   */
  private getCommonSymptoms(trimester: number): string[] {

    const symptoms = {
      1: [
        '입덧',
        '피로감',
        '유방 통증',
      ],
      2: [
        '요통',
        '다리 경련',
        '부종 시작',
      ],
      3: [
        '강한 수축',
        '양수 터짐 가능',
        '진통',
      ],
    };

    return symptoms[trimester] ?? [];
  }

  /**
   * 분기별 기본 건강 팁
   */
  private getDefaultTip(trimester: number): string {

    const tips = {
      1: '무리한 활동을 줄이고 충분한 휴식을 취하세요.',
      2: '규칙적인 가벼운 운동을 유지하세요.',
      3: '수분 섭취를 늘리고 낙상에 주의하세요.',
    };

    return tips[trimester] ?? '건강 상태를 주의 깊게 관찰하세요.';
  }
  /**
* BMI 기준 권장 체중 증가량 계산
*/
  private calculateRecommendedWeight(pregnancy: any): string {

    const bmi = pregnancy.bmi;
    const week = pregnancy.week;
    const isMultiple = pregnancy.is_multiple === true;

    // 1분기 특수 처리
    if (week <= 13) {
      return '1분기 총 권장 증가량 0.5–2.0kg';
    }

    // 단태아
    if (!isMultiple) {
      if (bmi < 18.5) return '12.7–18.1kg';
      if (bmi < 25) return '11.3–15.8kg';
      if (bmi < 30) return '6.8–11.3kg';
      return '5.0–9.0kg';
    }

    // 다태아
    if (bmi < 18.5) return '23–28kg';
    if (bmi < 25) return '17–25kg';
    if (bmi < 30) return '14–23kg';
    return '11–19kg';
  }

  private calculateGuidelineWeight(
    preWeight: number,
    bmi: number,
    currentWeek: number,
    isMultiple: boolean,
  ) {

    // 단태아 총 증가량
    const singletonGainMap = {
      UNDER: { min: 12.7, max: 18.1 },
      NORMAL: { min: 11.3, max: 15.8 },
      OVER: { min: 6.8, max: 11.3 },
      OBESE: { min: 5.0, max: 9.0 },
    };

    // 다태아 총 증가량
    const twinGainMap = {
      UNDER: { min: 23, max: 28 },
      NORMAL: { min: 17, max: 25 },
      OVER: { min: 14, max: 23 },
      OBESE: { min: 11, max: 19 },
    };

    const totalGainMap = isMultiple ? twinGainMap : singletonGainMap;

    let category: keyof typeof totalGainMap;

    if (bmi < 18.5) category = 'UNDER';
    else if (bmi < 25) category = 'NORMAL';
    else if (bmi < 30) category = 'OVER';
    else category = 'OBESE';

    const totalMin = totalGainMap[category].min;
    const totalMax = totalGainMap[category].max;

    // 0~12주
    if (currentWeek <= 12) {
      return {
        min: preWeight + 0.5,
        max: preWeight + 2.0,
      };
    }

    // 13~40주 선형 보간
    const week12Min = preWeight + 0.5;
    const week12Max = preWeight + 2.0;

    const ratio = (currentWeek - 12) / 28;

    const weekMin =
      week12Min + (preWeight + totalMin - week12Min) * ratio;

    const weekMax =
      week12Max + (preWeight + totalMax - week12Max) * ratio;

    return {
      min: Number(weekMin.toFixed(1)),
      max: Number(weekMax.toFixed(1)),
    };
  }

  /**
 * 주차별 건강 정보 조회
 */
  async getWeeklyHealth(userId: string) {

    const latest = await this.findLatestByUser(userId);

    if (!latest) {
      throw new NotFoundException('임신 정보가 없습니다.');
    }

    const { week, trimester } = latest;

    const recommendedWeight =
      this.calculateRecommendedWeight(latest);

    const symptoms =
      this.getCommonSymptoms(trimester);

    const tip =
      this.getDefaultTip(trimester);

    const guidelineRange =
      this.calculateGuidelineWeight(
        latest.pre_weight,
        latest.bmi,
        latest.week,
        latest.is_multiple === true,
      );

    let weightStatus = '정상 범위';

    if (latest.current_weight < guidelineRange.min) {
      weightStatus = '권장 범위 미달';
    } else if (latest.current_weight > guidelineRange.max) {
      weightStatus = '권장 범위 초과';
    }

    return {
      week,
      recommended_weight_gain: recommendedWeight,
      guideline_range_today: guidelineRange,
      current_weight_status: weightStatus,
      common_symptoms: symptoms,
      today_tip: tip,
    };
  }

  /**
  * 최근 4주 기준 체중 증가 추세 분석
  */
  async calculateWeightTrend(userId: string) {

    const pregnancy = await this.pregnancyRepository.findOne({
      where: { user_id: userId },
      order: { pregnancy_id: 'DESC' },
    });

    if (!pregnancy) {
      throw new NotFoundException('임신 정보가 없습니다.');
    }

    const week =
      this.calculateWeek(
        pregnancy.last_menstrual_period,
      );

    const logs = await this.weightRepository.find({
      where: { pregnancy_id: pregnancy.pregnancy_id },
      order: { week: 'DESC' },
    });

    const latestLog = logs[0];
    const currentWeight =
      latestLog?.weight ?? pregnancy.pre_weight;

    // 현재 위치 (선형 보간)
    const guidelineRange =
      this.calculateGuidelineWeight(
        pregnancy.pre_weight,
        pregnancy.bmi,
        week,
        pregnancy.is_multiple === true,
      );

    let currentPositionStatus = '정상 범위';

    if (currentWeight < guidelineRange.min) {
      currentPositionStatus = '권장 범위 미달';
    } else if (currentWeight > guidelineRange.max) {
      currentPositionStatus = '권장 범위 초과';
    }

    // 증가 속도 분석

    if (logs.length < 2) {
      return {
        current_position: {
          range: guidelineRange,
          status: currentPositionStatus,
        },
        slope: 0,
        status: '데이터 부족',
      };
    }

    const recentLogs = logs.slice(0, 4).reverse();
    const first = recentLogs[0];
    const last = recentLogs[recentLogs.length - 1];
    const weekDiff = last.week - first.week;

    if (weekDiff <= 0) {
      return {
        current_position: {
          range: guidelineRange,
          status: currentPositionStatus,
        },
        slope: 0,
        status: '분석 불가',
      };
    }

    const slope =
      (last.weight - first.weight) /
      weekDiff;

    // 1분기 속도 판단 제외
    if (week <= 12) {
      return {
        current_position: {
          range: guidelineRange,
          status: currentPositionStatus,
        },
        slope: Number(slope.toFixed(2)),
        slope_status: '1분기는 증가 속도 판단 제외',
      };
    }

    const bmi = pregnancy.bmi;
    const isMultiple = pregnancy.is_multiple === true;

    let minSlope = 0;
    let maxSlope = 0;

    // 단태아
    if (!isMultiple) {
      if (bmi < 18.5) { minSlope = 0.45; maxSlope = 0.59; }
      else if (bmi < 25) { minSlope = 0.36; maxSlope = 0.45; }
      else if (bmi < 30) { minSlope = 0.22; maxSlope = 0.31; }
      else { minSlope = 0.18; maxSlope = 0.27; }
    }
    // 다태아
    else {
      if (bmi < 18.5) { minSlope = 0.75; maxSlope = 0.93; }
      else if (bmi < 25) { minSlope = 0.54; maxSlope = 0.82; }
      else if (bmi < 30) { minSlope = 0.43; maxSlope = 0.75; }
      else { minSlope = 0.32; maxSlope = 0.61; }
    }

    let slopeStatus = '정상 추세';

    if (slope > maxSlope) {
      slopeStatus = '과도 증가 추세';
    } else if (slope < minSlope) {
      slopeStatus = '증가 부족 추세';
    }

    return {
      based_on: `${recentLogs.length}주 기준`,
      current_position: {
        range: guidelineRange,
        status: currentPositionStatus,
      },
      slope: Number(slope.toFixed(2)),
      recommended_weekly_range: {
        min: minSlope,
        max: maxSlope,
      },
      slope_status: slopeStatus,
    };
  }
}