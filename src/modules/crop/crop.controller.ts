import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { CropService } from "./crop.service";
import { Crop } from "src/utils/database/src/entities/crop";

@Controller()
export class CropController {

    constructor(
        private readonly cropService: CropService
    ){}
    
    @Post('crop')
    async createUser(
        @Body() body: Crop
    ):Promise<any>{
        return this.cropService.create(body)
    }

    @Get('crop')
    async getUser(
        @Query('filter') filter: string
    ): Promise<any> {
        return await this.cropService.list()
    }
}


