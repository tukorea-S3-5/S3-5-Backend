import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getSessionReport(req: any, id: string): Promise<{
        total_duration: number;
        avg_heart_rate: null;
        max_heart_rate: null;
        exercises: {
            exercise_name: string;
            duration: number | null;
            avg_heart_rate: null;
            max_heart_rate: null;
        }[];
    }>;
}
