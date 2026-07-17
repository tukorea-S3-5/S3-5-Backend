export declare class ExerciseResultDto {
    exercise_id: number;
    exercise_name: string;
    category_name: string;
    intensity: string;
    position_type: string;
    fall_risk: boolean;
    allowed_trimesters: number[];
    description: string;
    difficulty_label: string;
    video_url?: string | null;
    ai_comment?: string;
}
