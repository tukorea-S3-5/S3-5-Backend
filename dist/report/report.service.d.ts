import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
export declare class ReportService {
    private readonly sessionRepository;
    private readonly recordRepository;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>);
    generateSessionReport(userId: string, sessionId: number): Promise<SessionReportResponseDto>;
}
