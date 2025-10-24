import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
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
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
  IdParamDto,
  IdParamSchema,
} from 'src/modules/users/dto/filter-users.dto';
import { PaginationDto, paginationSchema } from '../dto/padination.dto';
import { User } from 'src/common/decorators/getUser.decorator';
import { RequestUser } from 'src/modules/users/interfaces/request-user.interface';

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(AuthGuard, RolesGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createNote(
    @Body(new ZodPipe(createNoteSchema)) noteDto: CreateNoteDto,
    @User() req: RequestUser,
  ) {
    return await this.noteService.createNote(noteDto, req.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findAllNotes(
    @User() req: RequestUser,
    @Query(new ZodPipe(paginationSchema)) query: PaginationDto,
  ) {
    return await this.noteService.findAll(req, query.limit, query.page);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  async findNoteById(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @User() req: RequestUser,
  ) {
    console.log('Finding note by id:', params.id, 'for user:', req.id);
    return await this.noteService.findNoteById(params.id, req);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  async updateNote(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Body(new ZodPipe(updateNoteSchema)) noteDto: UpdateNoteDto,
    @User() req: RequestUser,
  ) {
    return await this.noteService.updateNote(params.id, noteDto, req);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'Note ID' })
  async deleteNote(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @User() req: RequestUser,
  ) {
    return await this.noteService.deleteNote(params.id, req);
  }
}
