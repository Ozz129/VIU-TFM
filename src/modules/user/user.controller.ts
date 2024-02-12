import { Body, Controller, Post, Query, Get, Param, UseGuards, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "src/utils/database/src/entities/user";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller()
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}
    
    @Post('user')
    async createUser(
        @Body() body: User
    ):Promise<any>{
        return this.userService.create(body)
    }

    @Get('user')
    async getUser(
        @Query('filter') filter: string
    ): Promise<any> {
        return await this.userService.list()
    }
    @UseGuards(JwtAuthGuard)
    @Get('user/api-key')
    async getUserApiKey(
        @Param('id') userId: string,
        @Request() req: any
    ) {
        const data = await this.userService.getApiKey(req.user.userId)
        console.log('+<+<+<+<', data)
        return {
            data: {
                apiKey: data.apiKey,
                fullName: data.fullName
            }
        }
    }

    @Post('login')
    async login(
        @Body() body: any
    ){
        
    }
}


