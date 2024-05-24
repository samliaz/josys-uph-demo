import { Injectable } from '@nestjs/common';
import { Prisma as MysqlPrisma } from '@prisma/mysql/client';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { MysqlDatabaseService } from 'src/database/mysql-database.service';

@Injectable()
export class EmployeeSQLRepository {
  constructor(
    private readonly prismaSQL: MysqlDatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(EmployeeSQLRepository.name);
  }

  async findEmployeeByEmployeeCode(employee_code: string) {
    return await this.prismaSQL.employee_external_profiles.findFirst({
      where: { employee_code },
    });
  }

  async createEmployee(
    userProfile: MysqlPrisma.employee_external_profilesCreateInput,
  ) {
    return await this.prismaSQL.employee_external_profiles.create({
      data: userProfile,
    });
  }

  async updateEmployeeById(
    id: number | bigint,
    userProfile: MysqlPrisma.employee_external_profilesUpdateInput,
  ) {
    return await this.prismaSQL.employee_external_profiles.update({
      where: { id },
      data: userProfile,
    });
  }
}
