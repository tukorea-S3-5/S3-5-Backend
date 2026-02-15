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
  } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  import { ReportService } from './report.service';
  
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
    getSessionReport(
      @Req() req,
      @Param('id') id: string,
    ) {
      return this.reportService.generateSessionReport(
        req.user.user_id,
        Number(id),
      );
    }
  }