"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const community_service_1 = require("./community.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
let CommunityController = class CommunityController {
    communityService;
    constructor(communityService) {
        this.communityService = communityService;
    }
    createPost(dto, req) {
        const userId = req.user.user_id;
        return this.communityService.createPost(dto.title, dto.content, userId);
    }
    getAllPosts() {
        return this.communityService.getAllPosts();
    }
    getPost(id) {
        return this.communityService.getPostById(id);
    }
    createComment(dto, req) {
        const userId = req.user.user_id;
        return this.communityService.createComment(dto.postId, dto.content, userId);
    }
    toggleLike(id, req) {
        const userId = req.user.user_id;
        return this.communityService.toggleLike(id, userId);
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, common_1.Post)('posts'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 작성' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 목록 조회' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 상세 조회' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "getPost", null);
__decorate([
    (0, common_1.Post)('comments'),
    (0, swagger_1.ApiOperation)({ summary: '댓글 작성' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "createComment", null);
__decorate([
    (0, common_1.Post)('posts/:id/like'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 좋아요 토글' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "toggleLike", null);
exports.CommunityController = CommunityController = __decorate([
    (0, swagger_1.ApiTags)('Community'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('community'),
    __metadata("design:paramtypes", [community_service_1.CommunityService])
], CommunityController);
//# sourceMappingURL=community.controller.js.map