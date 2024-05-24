import { Injectable } from '@nestjs/common';
import { Prisma as MysqlPrisma } from '@prisma/mysql/client';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { isNotEmpty } from 'class-validator';
import {
  EmployeePage,
  ExternalEmployeeProfile,
} from './dto/externalEmployeeProfile.dto';
import { EmployeeSQLRepository } from './repositories/employee.sql.repository';

@Injectable()
export class EmployeeService {
  constructor(
    private employeeSQLRepository: EmployeeSQLRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(EmployeeService.name);
  }

  async processRecords(employeePage: EmployeePage) {
    try {
      this.logger.info(
        'Started processing department records for page ' + employeePage.pageId,
        this.processRecords.name,
        EmployeeService.name,
      );

      const errorList = [];
      let updated = 0;
      let created = 0;

      for (const employeeExternalProfile of employeePage.employees) {
        try {
          const employee = await this.findEmployee(
            employeeExternalProfile.employee_code,
          );

          if (!employee) {
            await this.createEmployee(
              this.translateExternalEmployeeProfile(employeeExternalProfile),
            );
            this.logger.info('Created Employee');
            created += 1;
          } else {
            await this.updateEmployeeById(
              employee.id,
              this.translateExternalEmployeeProfile(
                employeeExternalProfile,
                employee.employee_id,
              ),
            );
            updated += 1;
            this.logger.info('Updated Employee');
          }
        } catch (error) {
          errorList.push({
            employeeId: employeeExternalProfile.id,
            errorMessage:
              error.msg || error.message
                ? error.message || error.msg
                : 'Failure in employee service',
            errorTrace: error,
          });
        }
      }
      return {
        successCount: employeePage.employees.length - errorList.length,
        failedCount: errorList.length,
        created,
        updated,
        errorList,
      };
    } catch (error) {
      this.logger.error(error, this.processRecords.name, EmployeeService.name);
      throw error;
    }
  }

  async findEmployee(employee_code: string) {
    return await this.employeeSQLRepository.findEmployeeByEmployeeCode(
      employee_code,
    );
  }

  async createEmployee(
    employee: MysqlPrisma.employee_external_profilesCreateInput,
  ) {
    return await this.employeeSQLRepository.createEmployee(employee);
  }

  async updateEmployeeById(
    employeeId: bigint,
    employee: MysqlPrisma.employee_external_profilesUpdateInput,
  ) {
    return await this.employeeSQLRepository.updateEmployeeById(
      employeeId,
      employee,
    );
  }

  translateExternalEmployeeProfile(
    externalEmployee: ExternalEmployeeProfile,
    employeeId?: bigint,
  ): MysqlPrisma.employee_external_profilesCreateInput {
    return {
      employee_id: employeeId ? BigInt(employeeId) : Date.now(),
      employee_ledger_integration_id: BigInt(externalEmployee.integration_id),
      organization_id: BigInt(externalEmployee.organization_id),
      first_name: externalEmployee.first_name,
      last_name: externalEmployee.last_name,
      employee_code: externalEmployee.employee_code,
      personal_email: externalEmployee.personal_email,
      title: externalEmployee.title,
      employment_status: Number(externalEmployee.employment_status),
      employment_type: Number(externalEmployee.employment_type),
      joined_on: isNotEmpty(externalEmployee.joined_on)
        ? new Date(externalEmployee.joined_on)
        : null,
      resigned_on: isNotEmpty(externalEmployee.resigned_on)
        ? new Date(externalEmployee.resigned_on)
        : null,
      username: null,
      email: externalEmployee.email,
      status: null,
    };
  }
}
