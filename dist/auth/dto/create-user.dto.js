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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    email;
    password;
    name;
    birth_date;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'test@tukorea.ac.kr',
        description: '사용자 이메일 (로그인 ID로 사용)',
    }),
    (0, class_validator_1.IsEmail)({}, { message: '올바른 이메일 형식이 아닙니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일은 필수 입력 항목입니다.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'test',
        description: '비밀번호 (최소 8자 이상)',
        required: true,
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '비밀번호는 필수 입력 항목입니다.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '홍길동',
        description: '사용자명',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이름은 필수 입력 항목입니다.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1996-05-20',
        description: '생년월일 (YYYY-MM-DD 형식)',
        required: true,
    }),
    (0, class_validator_1.IsDateString)({}, { message: '올바른 날짜 형식(YYYY-MM-DD)이어야 합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '생년월일은 필수 입력 항목입니다.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "birth_date", void 0);
//# sourceMappingURL=create-user.dto.js.map