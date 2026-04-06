import { AiService } from './ai.service';
import { CreateHealthReportDto } from './dto/create-health-report.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateHealthReport(dto: CreateHealthReportDto): Promise<{
        report: string;
    }>;
}
