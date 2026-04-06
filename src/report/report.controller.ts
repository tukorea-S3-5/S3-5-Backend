import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportService } from './report.service';
import { SessionReportResponseDto } from './dto/session-report-response.dto';

@ApiTags('Report')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  /**
   * 세션 리포트 조회
   */
  @Get('session/:id')
  @ApiOperation({ summary: '세션 리포트 조회' })
  @ApiResponse({
    status: 200,
    description: '세션 리포트 반환',
    type: SessionReportResponseDto,
  })
  async getSessionReport(
    @Req() req,
    @Param('id') id: string,
  ): Promise<SessionReportResponseDto> {
    return this.reportService.generateSessionReport(
      req.user.user_id,
      Number(id),
    );
  }
}