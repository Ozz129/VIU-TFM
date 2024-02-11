import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { UserRepository } from 'src/utils/database/src/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalAuthGuard } from './local-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'rigoIoT2024$', 
      signOptions: { expiresIn: '60m' }, 
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    UserRepository,
    AuthService,
    LocalStrategy,
    LocalAuthGuard
  ]
})
export class AuthModule {}
