import { IntegrationCompletedEvent } from '../event-stream-mock-rmq/dto/integration-completed-event.dto';

export class TestDataHelper {
  constructor(private readonly icEvent: IntegrationCompletedEvent) {}

  seedMongoDepartments(): { count: number } {
    //TODO: insert the actual departments
    return { count: 0 };
  }

  seedMongoUserProfiles(): { count: number } {
    //TODO: insert the actual departments
    return { count: 0 };
  }

  getMysqlDepartments(): { count: number } {
    //TODO: get mysql departments
    return { count: 0 };
  }

  getMysqlUserProfiles(): { count: number } {
    //TODO: get mysql departments
    return { count: 0 };
  }
}
