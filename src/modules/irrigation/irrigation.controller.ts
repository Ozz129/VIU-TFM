import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { IrrigationService } from "./irrigation.service";

@Controller()
export class IrrigationController {

    constructor(
        private readonly irrigationService: IrrigationService
    ){}
    

    @Post('irrigation')
    async createIrrigation(
        @Body() body: any
    ): Promise<any> {
        return this.irrigationService.create(body)
    }
}


