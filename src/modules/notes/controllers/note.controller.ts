import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { NoteService } from '../services/note.service';
import {
  CreateNoteDto,
  createNoteSchema,
  UpdateNoteDto,
  updateNoteSchema,
} from '../dto/note.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ZodPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateNoteDtoSwagger,
  PaginationDtoSwagger,
  UpdateNoteDtoSwagger,
} from '../dto/swagger-note.dto';
import { AuthenticatedRequest } from 'src/modules/users/interfaces/authenticated-request.interface';
import {
  IdParamDto,
  IdParamSchema,
} from 'src/modules/users/dto/filter-users.dto';
import { PaginationDto, paginationSchema } from '../dto/padination.dto';

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiBody({ type: CreateNoteDtoSwagger })
  @UsePipes(new ZodPipe(createNoteSchema))
  async createNote(
    @Body() noteDto: CreateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.noteService.createNote(noteDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiQuery({ type: PaginationDtoSwagger })
  async findAllNotes(
    @Request() req: AuthenticatedRequest,
    @Query(new ZodPipe(paginationSchema)) query: PaginationDto,
  ) {
    if (req.user.role === UserRole.ADMIN) {
      return await this.noteService.findAllNotes(query.limit, query.page);
    }
    if (req.user.role === UserRole.USER) {
      return await this.noteService.findNotesByUserId(
        req.user.id,
        query.limit,
        query.page,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  async findNoteById(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.noteService.findNoteById(params.id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDtoSwagger })
  async updateNote(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Body(new ZodPipe(updateNoteSchema)) noteDto: UpdateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.noteService.updateNote(params.id, noteDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  async deleteNote(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.noteService.deleteNote(params.id, req.user);
  }
}
