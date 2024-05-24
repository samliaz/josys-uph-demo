import { Module } from '@nestjs/common';

import { UserProfileWorkflowModule } from 'src/userprofile-workflow/userprofile-workflow.module';
import { ExternalDepartmentsRepository } from './repositories/external-department.repository';
import { ExternalDepartmentService } from './services/external-department.service';
import { ConsumerService } from './services/rabit-mq.service';
import { UserProfileEventAdaptor } from './services/userprofile-event-adaptor.service';
import { ExternalEmployeeService } from './services/external-employees.service';
import { ExternalEmployeeRepository } from './repositories/external-employee.repository';

@Module({
  providers: [
    ExternalDepartmentService,
    ExternalDepartmentsRepository,
    ExternalEmployeeService,
    ExternalEmployeeRepository,
    ConsumerService,
    UserProfileEventAdaptor,
  ],
  imports: [UserProfileWorkflowModule],
})
export class EventStreamMockRmqModule {}
