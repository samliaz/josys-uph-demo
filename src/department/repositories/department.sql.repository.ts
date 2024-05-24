import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { departments, Prisma as MysqlPrisma } from '@prisma/mysql/client';

import { MysqlDatabaseService } from 'src/database/mysql-database.service';

@Injectable()
export class DepartmentsSQLRepository {
  constructor(
    private readonly mysqlDB: MysqlDatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(MysqlDatabaseService.name);
  }

  async findDepartmentByOrganizationAndExternalId(
    organizationId: bigint,
    externalDepartmentId: string,
  ): Promise<departments> {
    return this.mysqlDB.departments.findFirst({
      where: {
        organization_id: organizationId,
        external_department_id: externalDepartmentId,
      },
    });
  }

  async createDepartment(
    department: MysqlPrisma.departmentsCreateInput,
  ): Promise<{ id: bigint }> {
    return this.mysqlDB.departments.create({
      select: {
        id: true,
      },
      data: department,
    });
  }

  async updateDepartmentById(
    id: bigint,
    department: MysqlPrisma.departmentsUpdateInput,
  ): Promise<{ id: bigint }> {
    return this.mysqlDB.departments.update({
      select: {
        id: true,
      },
      where: {
        id,
      },
      data: department,
    });
  }
}
