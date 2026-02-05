import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { StartExerciseDto } from './dto/start-exercise.dto';
import { EndExerciseDto } from './dto/end-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseSession)
    private readonly sessionRepository: Repository<ExerciseSession>,
  ) {}

  /** 운동 시작 */
  async startExercise(dto: StartExerciseDto): Promise<ExerciseSession> {

    // 이미 진행 중 운동이 있는지 체크
    const ongoing = await this.sessionRepository.findOne({
      where: { user_id: dto.user_id, status: 'ONGOING' },
    });

    if (ongoing) {
      throw new BadRequestException('이미 진행 중인 운동이 있습니다.');
    }

    const session = this.sessionRepository.create({
      user_id: dto.user_id,
      started_at: new Date(),
      status: 'ONGOING',
    });

    return this.sessionRepository.save(session);
  }

  /** 운동 종료 */
  async endExercise(dto: EndExerciseDto): Promise<ExerciseSession> {
    const session = await this.sessionRepository.findOne({
      where: { session_id: dto.session_id },
    });

    if (!session || session.status !== 'ONGOING') {
      throw new BadRequestException('종료할 수 없는 세션입니다.');
    }

    session.ended_at = new Date();
    session.status = 'COMPLETED';

    // 임시 값 -> IoT 연동 후 실제 값으로 변경 필요
    session.avg_hr = 110;
    session.max_hr = 145;

    return this.sessionRepository.save(session);
  }

  /** 사용자 운동 목록 */
  async getSessionsByUser(userId: string): Promise<ExerciseSession[]> {
    return this.sessionRepository.find({
      where: { user_id: userId },
      order: { started_at: 'DESC' },
    });
  }

  /** 현재 진행 중 운동 */
  async getOngoingSession(userId: string): Promise<ExerciseSession | null> {
    return this.sessionRepository.findOne({
      where: { user_id: userId, status: 'ONGOING' },
    });
  }
}