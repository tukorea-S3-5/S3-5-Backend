import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
import { AiService } from '../ai/ai.service';
export declare class ReportService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly aiService;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>, aiService: AiService);
    generateSessionReport(userId: string, sessionId: number): Promise<SessionReportResponseDto>;
}
