export declare class AiService {
    private openai?;
    constructor();
    generateExerciseComment(data: {
        week?: number;
        totalDuration: number;
        status: string;
        symptoms: string[];
        avgHeartRate: number;
        intensityLevel: string;
        trimesterNotice: string;
        exercises: {
            name: string;
            duration: number;
        }[];
    }): Promise<string>;
    private attachObjectParticle;
    private formatDuration;
    private generateMockComment;
    generateHealthReport(data: {
        week: number;
        bmi: number;
        weightStatus: string;
    }): Promise<string>;
    private generateMockHealthReport;
}
