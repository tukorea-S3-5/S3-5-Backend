import { RecommendService } from './recommend.service';
export declare class RecommendController {
    private readonly recommendService;
    constructor(recommendService: RecommendService);
    recommend(req: any): Promise<{
        recommend: import("../entities/exercise.entity").Exercise[];
        caution: import("../entities/exercise.entity").Exercise[];
        not_recommend: import("../entities/exercise.entity").Exercise[];
    }>;
}
