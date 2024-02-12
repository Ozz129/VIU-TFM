import { Body, Controller, Post, Query, Get, UseGuards, Request } from "@nestjs/common";
import { CropService } from "./crop.service";
import { Crop } from "src/utils/database/src/entities/crop";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller()
export class CropController {

    constructor(
        private readonly cropService: CropService
    ){}
    @UseGuards(JwtAuthGuard)
    @Post('crop')
    async createCrop(
        @Body() body: any,
        @Request() req: any
    ):Promise<any>{
        body = {...body, userId: req.user.userId}
        return this.cropService.create(body)
    }

    @UseGuards(JwtAuthGuard)
    @Get('crop')
    async getCrops(
        @Request() req: any
    ): Promise<any> {
        const id = req.user.userId
        return await this.cropService.list(id)
    }
}


