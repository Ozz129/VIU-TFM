import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "src/utils/database/src/entities/user";

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
}


