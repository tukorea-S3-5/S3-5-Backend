import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHealthReportDto } from './dto/create-health-report.dto';

@ApiTags('LLM AI')
@ApiBearerAuth('access-token') 
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('health-report')
  @ApiOperation({
    summary: '임산부 건강 리포트 생성',
    description: '임신 주차, BMI 정보를 기반으로 AI가 맞춤형 건강 조언을 생성합니다.',
  })
  @ApiBody({
    schema: {
      example: {
        week: 16,
        bmi: 22.5,
        weightStatus: '정상',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '건강 리포트 생성 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (JWT 필요)',
  })
  async generateHealthReport(@Body() dto: CreateHealthReportDto) {
    const report = await this.aiService.generateHealthReport(dto);
    return { report };
  }
}