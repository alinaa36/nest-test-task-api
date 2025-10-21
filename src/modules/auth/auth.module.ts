import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../users/users.module';
import { JwtConfigModule } from 'src/common/config/jwt-config.module';

@Module({
  imports: [JwtConfigModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
