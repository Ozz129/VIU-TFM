import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { ConstantsService } from "./constanst.service";

@Controller()
export class ConstantsController {

    constructor(
        private readonly constantsService: ConstantsService
    ){}
    

    @Get('constants')
    async getCropTypes(
        @Query('filter') filter: string
    ): Promise<any> {
        return await this.constantsService.listConstants(filter)
    }
}


