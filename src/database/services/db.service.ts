import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  public db;
  private pool: Pool;
  private readonly logger = new Logger(DrizzleService.name);

  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    this.pool = new Pool({
      connectionString: this.configService.get<string>('POSTGRES_URL'),
      max: 10,
    });

    try {
      await this.pool.query('SELECT 1');
      this.db = drizzle(this.pool, { schema });
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection closed');
  }
}
