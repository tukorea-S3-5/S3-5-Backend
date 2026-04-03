import { SessionExerciseDto } from './session-exercise.dto';
export declare class SessionReportResponseDto {
    total_duration: number;
    avg_heart_rate: number | null;
    max_heart_rate: number | null;
    exercises: SessionExerciseDto[];
}
