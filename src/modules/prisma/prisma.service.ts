import 'dotenv/config';

import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    PrismaService.ensureDatasourceUrl();

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  private static ensureDatasourceUrl(): void {
    if (process.env.DATABASE_URL) {
      return;
    }

    const dockerUrl = process.env.DATABASE_URL_DOCKER;

    if (dockerUrl) {
      process.env.DATABASE_URL = dockerUrl;
      return;
    }

    throw new Error(
      'DATABASE_URL (or DATABASE_URL_DOCKER) must be provided for PrismaClient.',
    );
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    const shutdown = async () => {
      await app.close();
    };

    process.on('beforeExit', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}
