import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { Department } from '@prisma/mongo/client';

import { ExternalDepartmentsRepository } from '../repositories/external-department.repository';

@Injectable()
export class ExternalDepartmentService {
  constructor(
    private readonly externalDepartmentRepository: ExternalDepartmentsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ExternalDepartmentService.name);
  }

  async getDepartmentsBySessionId(sessionId: string): Promise<Department[]> {
    this.logger.info(
      'Fetching external departments records',
      this.getDepartmentsBySessionId.name,
      ExternalDepartmentService.name,
    );

    try {
      const externalDepartments =
        await this.externalDepartmentRepository.findDepartmentsBySessionId(
          sessionId,
        );

      return externalDepartments;
    } catch (error) {
      throw new Error(
        'Failed fetching external department records. ' + error.message,
      );
    }
  }
}
