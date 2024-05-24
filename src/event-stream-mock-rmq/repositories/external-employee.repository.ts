import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { MongoDatabaseService } from 'src/database/mongo-database.service';
import { Employee } from '@prisma/mongo/client';

@Injectable()
export class ExternalEmployeeRepository {
  constructor(
    private readonly prismaMongo: MongoDatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ExternalEmployeeRepository.name);
  }

  async fetchEmployeeProfiles(session_id: any): Promise<Employee[]> {
    return await this.prismaMongo.employee.findMany({
      where: { session_id: session_id },
    });
  }
}
