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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../entities/post.entity");
const comment_entity_1 = require("../entities/comment.entity");
const post_like_entity_1 = require("../entities/post-like.entity");
let CommunityService = class CommunityService {
    postRepository;
    commentRepository;
    likeRepository;
    constructor(postRepository, commentRepository, likeRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }
    async createPost(title, content, userId) {
        const post = this.postRepository.create({
            title,
            content,
            userId,
        });
        return await this.postRepository.save(post);
    }
    async getAllPosts(currentUserId) {
        const posts = await this.postRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        const result = [];
        for (const post of posts) {
            const commentsCount = await this.commentRepository.count({
                where: { postId: post.id },
            });
            const isLiked = await this.likeRepository.exist({
                where: {
                    postId: post.id,
                    userId: currentUserId,
                },
            });
            result.push({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                user: {
                    user_id: post.user.user_id,
                    name: post.user.name,
                    profileImage: post.user.profileImage,
                },
                likes: post.likes,
                commentsCount,
                isLiked,
            });
        }
        return result;
    }
    async getPostById(id, currentUserId) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        post.views += 1;
        await this.postRepository.save(post);
        const comments = await this.commentRepository.find({
            where: { postId: id },
            order: { createdAt: 'ASC' },
        });
        const commentsCount = comments.length;
        const isLiked = await this.likeRepository.exist({
            where: {
                postId: id,
                userId: currentUserId,
            },
        });
        return {
            post: {
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                views: post.views,
                likes: post.likes,
                user: {
                    user_id: post.user.user_id,
                    name: post.user.name,
                    profileImage: post.user.profileImage,
                },
            },
            comments,
            commentsCount,
            isLiked,
        };
    }
    async createComment(postId, content, userId) {
        const comment = this.commentRepository.create({
            postId,
            content,
            userId,
        });
        return await this.commentRepository.save(comment);
    }
    async toggleLike(postId, userId) {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        const existingLike = await this.likeRepository.findOne({
            where: { postId, userId },
        });
        if (existingLike) {
            await this.likeRepository.remove(existingLike);
            post.likes -= 1;
            await this.postRepository.save(post);
            return { liked: false, likes: post.likes };
        }
        const like = this.likeRepository.create({ postId, userId });
        await this.likeRepository.save(like);
        post.likes += 1;
        await this.postRepository.save(post);
        return { liked: true, likes: post.likes };
    }
    async getLikedPosts(userId) {
        const likes = await this.likeRepository.find({
            where: { userId },
            relations: ['post', 'post.user'],
            order: { createdAt: 'DESC' },
        });
        return likes.map(like => ({
            id: like.post.id,
            title: like.post.title,
            content: like.post.content,
            createdAt: like.post.createdAt,
            user: {
                user_id: like.post.user.user_id,
                name: like.post.user.name,
                profileImage: like.post.user.profileImage,
            },
            likes: like.post.likes,
        }));
    }
    async getMyPosts(userId) {
        const posts = await this.postRepository.find({
            where: { userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        const result = [];
        for (const post of posts) {
            const commentsCount = await this.commentRepository.count({
                where: { postId: post.id },
            });
            result.push({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                user: {
                    user_id: post.user.user_id,
                    name: post.user.name,
                    profileImage: post.user.profileImage,
                },
                likes: post.likes,
                commentsCount,
                isLiked: false,
            });
        }
        return result;
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(post_like_entity_1.PostLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommunityService);
//# sourceMappingURL=community.service.js.map