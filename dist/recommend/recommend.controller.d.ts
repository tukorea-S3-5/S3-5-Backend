import { RecommendService } from './recommend.service';
export declare class RecommendController {
    private readonly recommendService;
    constructor(recommendService: RecommendService);
    recommend(req: any): Promise<{
        recommend: any[];
        caution: any[];
        not_recommend: any[];
    }>;
}
