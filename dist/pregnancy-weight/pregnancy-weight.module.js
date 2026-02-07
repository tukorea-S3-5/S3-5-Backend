"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PregnancyWeightModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pregnancy_info_entity_1 = require("../entities/pregnancy-info.entity");
const pregnancy_weight_log_entity_1 = require("../entities/pregnancy-weight-log.entity");
const pregnancy_weight_service_1 = require("./pregnancy-weight.service");
const pregnancy_weight_controller_1 = require("./pregnancy-weight.controller");
let PregnancyWeightModule = class PregnancyWeightModule {
};
exports.PregnancyWeightModule = PregnancyWeightModule;
exports.PregnancyWeightModule = PregnancyWeightModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pregnancy_info_entity_1.PregnancyInfo,
                pregnancy_weight_log_entity_1.PregnancyWeightLog,
            ]),
        ],
        controllers: [
            pregnancy_weight_controller_1.PregnancyWeightController,
        ],
        providers: [
            pregnancy_weight_service_1.PregnancyWeightService,
        ],
    })
], PregnancyWeightModule);
//# sourceMappingURL=pregnancy-weight.module.js.map