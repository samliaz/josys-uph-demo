import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { UserProfilePageEvent } from '../../userprofile-workflow/dto/userprofile-page-event.dto';
import { UserProfileWorkflowProcessor } from '../../userprofile-workflow/userprofile-workflow-processor.service';
import { IntegrationCompletedEvent } from '../dto/integration-completed-event.dto';
import { ExternalDepartmentService } from './external-department.service';
import { ExternalEmployeeService } from './external-employees.service';

@Injectable()
export class UserProfileEventAdaptor {
  constructor(
    private readonly externalDepartmentService: ExternalDepartmentService,
    private readonly userProfileEventHandler: UserProfileWorkflowProcessor,
    private readonly externalEmployeeService: ExternalEmployeeService,

    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserProfileEventAdaptor.name);
  }

  public async processEvent(eventMessage: IntegrationCompletedEvent) {
    try {
      const externalDepartments =
        await this.externalDepartmentService.getDepartmentsBySessionId(
          eventMessage.data.session_id,
        );

      const departmentPageEvent: UserProfilePageEvent = {
        ...eventMessage,
        data: {
          session_id: eventMessage.data.session_id,
          page_id: '1',
          record_type: 'department',
          data_records: externalDepartments,
        },
      };

      const departmentEventResult =
        await this.userProfileEventHandler.processPageEvent(
          departmentPageEvent,
        );

      this.logger.info(
        'Department Results: ' +
          JSON.stringify({ departmentEventResult }, null, 2),
        this.processEvent.name,
        UserProfileEventAdaptor.name,
      );

      const externalEmployeeProfiles =
        await this.externalEmployeeService.fetchEmployeeProfiles(
          eventMessage.data.session_id,
        );

      const employeePageEvent: UserProfilePageEvent = {
        ...eventMessage,
        data: {
          session_id: eventMessage.data.session_id,
          page_id: '1',
          record_type: 'employee',
          data_records: externalEmployeeProfiles,
        },
      };
      const employeeEventResult =
        await this.userProfileEventHandler.processPageEvent(employeePageEvent);

      this.logger.info(
        'Employee Results: ' + JSON.stringify({ employeeEventResult }, null, 2),
        this.processEvent.name,
        UserProfileEventAdaptor.name,
      );
    } catch (error) {
      this.logger.error(
        error,
        this.processEvent.name,
        UserProfileEventAdaptor.name,
      );
    }
  }
}
