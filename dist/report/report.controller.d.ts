import { ReportService } from './report.service';
import { SessionReportResponseDto } from './dto/session-report-response.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getSessionReport(req: any, id: string): Promise<SessionReportResponseDto>;
}
