import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NoteRepository } from '../repositories/note.repository';
import { UpdateNote } from '../types/note.type';
import { CreateNoteDto } from '../dto/note.dto';
import { UserRole } from 'src/modules/users/enums/role.enum';
import { RequestUser } from 'src/modules/users/interfaces/request-user.interface';

@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async createNote(note: CreateNoteDto, id: string) {
    const createdNote = await this.noteRepository.createNote({
      ...note,
      userId: id,
    });
    return createdNote;
  }

  async findNoteById(noteId: string, user: RequestUser) {
    const note = await this.noteRepository.findNoteById(noteId);
    this.userHasAccess(user, note.userId);

    if (!note) {
      return new NotFoundException(`Note with id ${noteId} not found`);
    }
    return note;
  }

  async findAllNotes(limit?: number, page?: number) {
    return await this.noteRepository.findAllNotes(limit, page);
  }

  async findNotesByUserId(userId: string, limit?: number, page?: number) {
    return await this.noteRepository.findNotesByUserId(userId, limit, page);
  }

  async updateNote(noteId: string, updateData: UpdateNote, user: RequestUser) {
    
    const note = await this.findNoteById(noteId, user);
    this.userHasAccess(user, note.userId);
    if (!note) {
      throw new NotFoundException(`Note with id ${noteId} not found`);
    }
    return await this.noteRepository.updateNote(note.id, updateData);
  }

  async deleteNote(noteId: string, user: RequestUser) {
    const note = await this.findNoteById(noteId, user);
    this.userHasAccess(user, note.userId);
    if (!note) {
      throw new NotFoundException(`Note with id ${noteId} not found`);
    }
    return await this.noteRepository.deleteNote(note.id);
  }

  private userHasAccess(user: RequestUser, targetUserId: string) {
    if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
      throw new ForbiddenException('You can only access or edit your own data');
    }
  }
}
