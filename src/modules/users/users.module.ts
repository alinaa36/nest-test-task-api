import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from 'src/database/db.module';
import { JwtConfigModule } from 'src/common/config/jwt-config.module';

@Module({
  imports: [DatabaseModule, JwtConfigModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
