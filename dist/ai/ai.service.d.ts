type RecommendationType = 'recommend' | 'caution' | 'not_recommend';
export declare class AiService {
    private openai?;
    constructor();
    private isLlmEnabled;
    generateExerciseComment(data: {
        week?: number;
        trimester?: number;
        bmi?: number | null;
        maxAllowedBpm?: number | null;
        conditions?: string[];
        totalDuration: number;
        status: string;
        symptoms: string[];
        avgHeartRate: number;
        intensityLevel: string;
        trimesterNotice: string;
        ruleReasons?: string[];
        exercises: {
            name: string;
            duration: number;
        }[];
    }): Promise<string>;
    private attachObjectParticle;
    private formatDuration;
    private generateMockComment;
    generateRecommendationComment(data: {
        type: RecommendationType;
        week?: number;
        trimester?: number;
        bmi?: number | null;
        symptoms: string[];
        conditions: string[];
        exercise: {
            name: string;
            category: string;
            intensity: string;
            positionType: string;
            fallRisk: boolean;
            description: string;
        };
        ruleReasons: string[];
    }): Promise<string>;
    private generateMockRecommendationComment;
    generateHealthReport(data: {
        week: number;
        bmi: number;
        weightStatus: string;
    }): Promise<string>;
    private generateMockHealthReport;
}
export {};
