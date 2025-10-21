import { Module } from '@nestjs/common';
import { DrizzleService } from './services/db.service';

@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DatabaseModule {}
