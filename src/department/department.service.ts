import { Injectable } from '@nestjs/common';
import { Prisma as MysqlPrisma, departments } from '@prisma/mysql/client';
import { Department } from '@prisma/mongo/client';
import { Prisma } from '@prisma/mongo/client';
import { isNil, parseInt } from 'lodash';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { DepartmentsSQLRepository } from './repositories/department.sql.repository';
import { CommonSQLRepository } from './repositories/common.sql.repository';
import { DepartmentServiceError } from './exceptions/departmentServiceError';
import { DepartmentPage } from './dto/department-page.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentSQLRepository: DepartmentsSQLRepository,
    private readonly commonSQLRepository: CommonSQLRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(DepartmentService.name);
  }

  async processRecords(departmentPage: DepartmentPage) {
    this.logger.info(
      'Started processing department records for page ' + departmentPage.pageId,
      this.processRecords.name,
      DepartmentService.name,
    );

    try {
      const dataSource = await this.getDataSource(
        BigInt(departmentPage.integrationId),
        BigInt(departmentPage.organizationId),
      );

      const errorList = [];
      let departmentUpdated = 0;
      let departmentCreated = 0;

      for (const department of departmentPage.departments) {
        try {
          const coreDepartment = await this.findCoreDepartment(
            BigInt(departmentPage.organizationId),
            department.id,
          );

          const parentId = await this.updateParentDepartment(
            department,
            departmentPage.organizationId,
            dataSource,
          );

          const departmentAttributes: MysqlPrisma.departmentsCreateInput = {
            organization_id: BigInt(departmentPage.organizationId),
            name: department.name,
            department_code: department.code,
            external_department_id: department.id,
            data_source: dataSource,
            display_order: parseInt(department.position) || 1,
            parent_id: parentId,
          };

          if (isNil(coreDepartment)) {
            await this.createCoreDepartment(departmentAttributes);
            departmentCreated++;
          } else {
            await this.updateCoreDepartment(
              coreDepartment.id,
              departmentAttributes,
            );
            departmentUpdated++;
          }
        } catch (error) {
          errorList.push({
            departmentId: department.id,
            errorMessage:
              error.msg || error.message
                ? error.message || error.msg
                : 'Failure in department service',
            errorTrace: error,
          });
        }
      }

      this.logger.debug(
        'department processRecords errorList: ' +
          JSON.stringify(errorList, null, 2),
        this.processRecords.name,
        DepartmentService.name,
      );

      return {
        pageId: departmentPage.pageId,
        successCount: departmentPage.departments.length - errorList.length,
        failedCount: errorList.length,
        departmentUpdated,
        departmentCreated,
        errorList,
      };
    } catch (error) {
      throw new DepartmentServiceError(error.message);
    }
  }

  private async getDataSource(
    integrationId: bigint,
    organizationId: bigint,
  ): Promise<number> {
    const integration =
      await this.commonSQLRepository.findIntegrationsByOrganizationId(
        integrationId,
        organizationId,
      );

    if (isNil(integration)) {
      throw new Error(
        `Data source not found for integrationId: ${integrationId} and organizationId: ${organizationId}`,
      );
    }

    return Number(integration.id);
  }

  private async findCoreDepartment(
    organizationId: bigint,
    departmentId: string,
  ) {
    return this.departmentSQLRepository.findDepartmentByOrganizationAndExternalId(
      organizationId,
      departmentId,
    );
  }

  private async createCoreDepartment(
    departmentAttributes: MysqlPrisma.departmentsCreateInput,
  ): Promise<{ id: bigint }> {
    return this.departmentSQLRepository.createDepartment(departmentAttributes);
  }

  private async updateCoreDepartment(
    coreDepartmentId: bigint,
    departmentAttributes: MysqlPrisma.departmentsCreateInput,
  ): Promise<{ id: bigint }> {
    return this.departmentSQLRepository.updateDepartmentById(
      coreDepartmentId,
      departmentAttributes,
    );
  }

  private async updateParentDepartment(
    department: Department,
    organizationId: string,
    dataSource: number,
  ): Promise<departments['id'] | null> {
    if (isNil(department.parent)) {
      return null;
    }
    try {
      const parentFromMongo = department.parent as Prisma.JsonObject;
      const coreParentDepartment = await this.findCoreDepartment(
        BigInt(organizationId),
        parentFromMongo.id as string,
      );

      const parentAttributes: MysqlPrisma.departmentsCreateInput = {
        organization_id: BigInt(organizationId),
        name: parentFromMongo.name as string,
        department_code: parentFromMongo.code as string,
        external_department_id: parentFromMongo.id as string,
        data_source: dataSource,
        display_order: parseInt(parentFromMongo.position as string) || 1,
      };

      const parentDepartment = isNil(coreParentDepartment)
        ? await this.createCoreDepartment(parentAttributes)
        : await this.updateCoreDepartment(
            coreParentDepartment.id,
            parentAttributes,
          );
      return parentDepartment.id;
    } catch (error) {
      this.logger.error(error, 'Error while processing parent department');
    }
  }
}
