import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MysqlPrismaClient } from '@prisma/mysql/client';

@Injectable()
export class MysqlDatabaseService
  extends MysqlPrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
