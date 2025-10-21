import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/user.dto';
import { UserRole } from 'src/modules/users/enums/role.enum';
import { UserService } from 'src/modules/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { id } from 'zod/v4/locales';
import { LoginDto } from '../dto/auth.dto';

export interface Payload {
  id: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(payload: Payload) {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async register(userDto: CreateUserDto) {
    try {
      const existingUser = await this.userService.findUserByEmail(
        userDto.email,
      );
      if (existingUser) {
        throw new BadRequestException(
          `User with email ${userDto.email} already exists`,
        );
      }
      const password = await bcrypt.hash(userDto.passwordHash, 10);
      const user = await this.userService.create({
        ...userDto,
        passwordHash: password,
      });
      const token = await this.generateToken({
        id: user.id,
        role: user.role,
      });
      return { id: user.id, ...token };
    } catch (error: any) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findUserByEmail(loginDto.email);
      if (!user) {
        throw new BadRequestException(
          `User with email ${loginDto.email} not found`,
        );
      }

      if (user.isBlocked) {
        throw new BadRequestException(`User is blocked`);
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new BadRequestException(`Invalid password`);
      }
      const token = await this.generateToken({
        id: user.id,
        role: user.role,
      });
      return { id: user.id, ...token };
    } catch (error: any) {
      throw error;
    }
  }
}
