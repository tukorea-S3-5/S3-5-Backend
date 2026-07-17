import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
import { AiService } from '../ai/ai.service';
export declare class ReportService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly pregnancyRepository;
    private readonly symptomRepository;
    private readonly aiService;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>, pregnancyRepository: Repository<PregnancyInfo>, symptomRepository: Repository<SymptomLog>, aiService: AiService);
    private calculateWeek;
    private calculateTrimester;
    private getTrimesterNotice;
    private buildReportRuleReasons;
    generateSessionReport(userId: string, sessionId: number): Promise<SessionReportResponseDto>;
}
