import { RecommendService } from './recommend.service';
import { RecommendResponseDto } from './dto/recommend-response.dto';
export declare class RecommendController {
    private readonly recommendService;
    constructor(recommendService: RecommendService);
    recommend(req: any): Promise<RecommendResponseDto>;
}
