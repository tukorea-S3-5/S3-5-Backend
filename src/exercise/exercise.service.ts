import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { StartExerciseDto } from './dto/start-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,
  ) {}

  /**
   * 운동 시작
   * - 이미 진행 중인 운동이 있으면 시작 불가
   * - exercise_type은 기록용으로 저장
   */
  async startExercise(
    userId: string,
    dto: StartExerciseDto,
  ) {
    // 해당 사용자에게 진행 중인 운동이 있는지 확인
    const ongoing =
      await this.sessionRepository.findOne({
        where: {
          user_id: userId,
          status: 'ONGOING',
        },
      });

    if (ongoing) {
      throw new BadRequestException(
        '이미 진행 중인 운동이 있습니다.',
      );
    }

    // 새로운 운동 세션 생성
    const session =
      this.sessionRepository.create({
        user_id: userId,
        exercise_type:
          dto.exercise_type ?? null,
        started_at: new Date(),
        status: 'ONGOING',
      });

    return this.sessionRepository.save(session);
  }

  /**
   * 운동 종료
   * - 진행 중인 운동 세션을 찾아 종료 처리
   */
  async endExercise(userId: string) {
    const session =
      await this.sessionRepository.findOne({
        where: {
          user_id: userId,
          status: 'ONGOING',
        },
      });

    if (!session) {
      throw new BadRequestException(
        '진행 중인 운동이 없습니다.',
      );
    }

    session.ended_at = new Date();
    session.status = 'COMPLETED';

    return this.sessionRepository.save(session);
  }
}