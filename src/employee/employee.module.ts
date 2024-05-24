import { Module } from '@nestjs/common';
import { MongoDatabaseService } from 'src/database/mongo-database.service';
import { MysqlDatabaseService } from 'src/database/mysql-database.service';
import { EmployeeService } from './employee.service';
import { EmployeeSQLRepository } from './repositories/employee.sql.repository';

@Module({
  controllers: [],
  providers: [
    EmployeeService,
    EmployeeSQLRepository,
    MongoDatabaseService,
    MysqlDatabaseService,
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
