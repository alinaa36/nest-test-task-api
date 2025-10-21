import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDtoSwagger {
  @ApiPropertyOptional({
    example: 'Example Updated',
    description: 'New user name',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'example_new@example.com',
    description: 'New user email',
  })
  email?: string;
}

export class FilterUsersDtoSwagger {
  @ApiPropertyOptional({ example: 'Example', description: 'Filter by name' })
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by blocked status',
  })
  isBlocked?: boolean;
}
