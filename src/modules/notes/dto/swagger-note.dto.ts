import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDtoSwagger {
  @ApiProperty({ example: 'My first note', description: 'Note title' })
  title: string;

  @ApiProperty({ example: 'Note content here...', description: 'Note content' })
  content: string;
}

export class UpdateNoteDtoSwagger {
  @ApiProperty({
    example: 'Updated title',
    description: 'Note title',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: 'Updated content...',
    description: 'Note content',
    required: false,
  })
  content?: string;
}

export class PaginationDtoSwagger {
  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit?: number;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  page?: number;
}
