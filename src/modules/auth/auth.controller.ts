// auth.controller.ts
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'; // Necesitarás implementar este Guard si utilizas autenticación local

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
        @Body() body: any
    ) {
    return this.authService.login(body.username);
  }
}
