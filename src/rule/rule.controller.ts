// // test 용 컨트롤러 -> 실제 추천 API와는 별도

// import { Controller, Post, Body, UseGuards } from '@nestjs/common';
// import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
// import { RuleService } from './rule.service';
// import { AuthGuard } from '@nestjs/passport';


// /**
//  * Rule Engine 테스트 전용 컨트롤러
//  * - 분기 + 증상 기반 운동 후보 필터링
//  */
// @ApiTags('Rule') 
// @ApiBearerAuth('access-token')
// @UseGuards(AuthGuard('jwt'))
// @Controller('rule-test')
// export class RuleController {
//   constructor(
//     private readonly ruleService: RuleService,
//   ) {}

//   /**
//    * 분기 + 증상 입력받아
//    * 필터링된 운동 후보 반환
//    */
//   @Post()
//   @ApiOperation({
//     summary: 'Rule Engine 테스트 - 운동 후보 필터링',
//   })
//   @ApiBody({
//     schema: {
//       example: {
//         trimester: 2,
//         symptoms: ['요통', '피로감'],
//       },
//     },
//   })
//   async testRule(
//     @Body()
//     body: {
//       trimester: number;
//       symptoms: string[];
//     },
//   ) {
//     return this.ruleService.generateCandidates(
//       body.trimester,
//       body.symptoms,
//     );
//   }
// }