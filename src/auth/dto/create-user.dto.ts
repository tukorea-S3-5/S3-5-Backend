import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@tukorea.ac.kr',
    description: '사용자 이메일 (로그인 ID로 사용)',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  readonly email: string;

  @ApiProperty({
    example: 'test',
    description: '비밀번호 (최소 8자 이상)',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  //   @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  //   @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
  //     message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
  //   })
  readonly password: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자명',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  readonly name: string;

  @ApiProperty({
    example: '1996-05-20',
    description: '생년월일 (YYYY-MM-DD 형식)',
    required: true,
  })
  @IsDateString({}, { message: '올바른 날짜 형식(YYYY-MM-DD)이어야 합니다.' })
  @IsNotEmpty({ message: '생년월일은 필수 입력 항목입니다.' })
  readonly birth_date: string;
}
