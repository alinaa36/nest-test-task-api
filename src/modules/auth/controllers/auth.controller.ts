import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  CreateUserDto,
  createUserSchema,
} from 'src/modules/users/dto/user.dto';
import { ZodPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginDto, loginSchema } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodPipe(createUserSchema))
    body: CreateUserDto,
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body(new ZodPipe(loginSchema)) body: LoginDto) {
    const result = await this.authService.login(body);
    return result;
  }
}
