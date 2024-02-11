import { Body, Controller, Post, Query, Get, UseGuards, Request } from "@nestjs/common";
import { ConstantsService } from "./constanst.service";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller()
export class ConstantsController {

    constructor(
        private readonly constantsService: ConstantsService
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Get('constants')
    async getCropTypes(
        @Query('filter') filter: string,
        @Request() req: any
    ): Promise<any> {
        return await this.constantsService.listConstants(filter)
    }
}


