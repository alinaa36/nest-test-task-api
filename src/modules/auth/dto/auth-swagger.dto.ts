import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/users/enums/role.enum';

export class RegisterDtoSwagger {
  @ApiProperty({ example: 'Example', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  passwordHash: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'User role',
    enum: UserRole,
  })
  role: UserRole;
}

export class LoginDtoSwagger {
  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  password: string;
}