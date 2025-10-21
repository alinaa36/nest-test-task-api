import { Module } from '@nestjs/common';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { NoteRepository } from './repositories/note.repository';
import { DatabaseModule } from 'src/database/db.module';
import { JwtConfigModule } from 'src/common/config/jwt-config.module';

@Module({
  imports: [DatabaseModule, JwtConfigModule],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
})
export class NoteModule {}
