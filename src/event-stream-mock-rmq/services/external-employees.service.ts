import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { ExternalEmployeeRepository } from '../repositories/external-employee.repository';
import { Employee } from '@prisma/mongo/client';

@Injectable()
export class ExternalEmployeeService {
  constructor(
    private readonly externalEmployeeRepository: ExternalEmployeeRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ExternalEmployeeService.name);
  }
  async fetchEmployeeProfiles(sessionId: string): Promise<Employee[]> {
    this.logger.info(
      'Fetching external departments records',
      this.fetchEmployeeProfiles.name,
      ExternalEmployeeRepository.name,
    );

    try {
      const externalEmployees =
        await this.externalEmployeeRepository.fetchEmployeeProfiles(sessionId);

      return externalEmployees;
    } catch (error) {
      throw new Error(
        'Failed fetching external department records. ' + error.message,
      );
    }
  }
}
