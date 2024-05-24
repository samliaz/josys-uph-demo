import { Module } from '@nestjs/common';

import { DepartmentService } from './department.service';
import { DepartmentsSQLRepository } from './repositories/department.sql.repository';
import { CommonSQLRepository } from './repositories/common.sql.repository';

@Module({
  providers: [DepartmentService, DepartmentsSQLRepository, CommonSQLRepository],
  exports: [DepartmentService],
})
export class DepartmentModule {}
