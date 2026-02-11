import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  
  import { SymptomService } from './symptom.service';
  import { CreateSymptomDto } from './dto/create-symptom.dto';
  
  @ApiTags('Symptom')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Controller('symptom')
  export class SymptomController {
    constructor(private readonly symptomService: SymptomService) {}
  
    /**
     * 증상 입력
     */
    @Post()
    @ApiOperation({ summary: '증상 입력' })
    async create(@Req() req, @Body() dto: CreateSymptomDto) {
      const userId = req.user.user_id;
  
      return this.symptomService.createSymptoms(
        userId,
        dto.symptoms,
      );
    }
  
    /**
     * 증상 이력 조회
     */
    @Get('history')
    @ApiOperation({ summary: '증상 이력' })
    async history(@Req() req) {
      const userId = req.user.user_id;
  
      return this.symptomService.getHistory(userId);
    }
  }