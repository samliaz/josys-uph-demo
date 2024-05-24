import { Injectable } from '@nestjs/common';
import { Department } from '@prisma/mongo/client';

import { MongoDatabaseService } from 'src/database/mongo-database.service';

@Injectable()
export class ExternalDepartmentsRepository {
  constructor(private readonly mongoDB: MongoDatabaseService) {}

  async findDepartmentsBySessionId(sessionId: string): Promise<Department[]> {
    return this.mongoDB.department.findMany({
      where: { session_id: sessionId },
    });
  }
}
