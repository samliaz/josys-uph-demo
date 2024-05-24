import { Global, Module } from '@nestjs/common';
import { MysqlDatabaseService } from './mysql-database.service';
import { MongoDatabaseService } from './mongo-database.service';

@Global()
@Module({
  providers: [MysqlDatabaseService, MongoDatabaseService],
  exports: [MysqlDatabaseService, MongoDatabaseService],
})
export class DatabaseModule {}
