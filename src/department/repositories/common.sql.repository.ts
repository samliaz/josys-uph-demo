import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { integrations, softwares } from '@prisma/mysql/client';

import { MysqlDatabaseService } from 'src/database/mysql-database.service';

@Injectable()
export class CommonSQLRepository {
  constructor(
    private readonly mysqlDB: MysqlDatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CommonSQLRepository.name);
  }

  async findIntegrationsByOrganizationId(
    integrationId: bigint,
    organizationId: bigint,
  ): Promise<integrations> {
    return this.mysqlDB.integrations.findFirst({
      where: {
        id: integrationId,
        organization_id: organizationId,
      },
    });
  }

  async findSoftwaresById(softwareId: bigint): Promise<softwares> {
    return this.mysqlDB.softwares.findFirst({
      where: { id: softwareId },
    });
  }
}
