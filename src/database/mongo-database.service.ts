import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MongoPrismaClient } from '@prisma/mongo/client';

@Injectable()
export class MongoDatabaseService
  extends MongoPrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
