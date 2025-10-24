import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from 'src/modules/notes/dto/note.dto';
import { NoteRepository } from 'src/modules/notes/repositories/note.repository';
import { UpdateNote } from 'src/modules/notes/types/note.type';
import { UserRole } from 'src/modules/users/enums/role.enum';
import { RequestUser } from 'src/modules/users/interfaces/request-user.interface';

@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async createNote(note: CreateNoteDto, userId: string) {
    return this.noteRepository.create({
      ...note,
      userId,
    });
  }

  async findNoteById(noteId: string, user: RequestUser) {
    const note = await this.noteRepository.findByIdWithAccess(
      noteId,
      user.role === UserRole.ADMIN ? undefined : user.id,
    );

    if (!note) {
      throw new NotFoundException(
        `Note with id ${noteId} not found or access denied`,
      );
    }

    return note;
  }

  async findAll(user: RequestUser, limit?: number, page?: number) {
    const notes = this.noteRepository.findAll({
      userId: user.role === UserRole.ADMIN ? undefined : user.id,
      limit,
      page,
    });

    return notes;
  }

  async updateNote(noteId: string, updateData: UpdateNote, user: RequestUser) {
    const updatedNote = await this.noteRepository.update(
      noteId,
      updateData,
      user.role === UserRole.ADMIN ? undefined : { userId: user.id },
    );

    if (!updatedNote) {
      throw new NotFoundException(
        `Note with id ${noteId} not found or access denied`,
      );
    }

    return updatedNote;
  }

  async deleteNote(noteId: string, user: RequestUser) {
    const result = await this.noteRepository.delete(
      noteId,
      user.role === UserRole.ADMIN ? undefined : { userId: user.id },
    );

    if (!result || result.rowCount === 0) {
      throw new NotFoundException(
        `Note with id ${noteId} not found or access denied`,
      );
    }

    return { message: 'Note deleted successfully' };
  }
}
