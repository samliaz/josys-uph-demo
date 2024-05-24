import { Injectable } from '@nestjs/common';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { DepartmentService } from 'src/department/department.service';
import { UserProfilePageEvent } from './dto/userprofile-page-event.dto';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class UserProfileWorkflowProcessor {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserProfileWorkflowProcessor.name);
  }

  public async processPageEvent(userProfilePageEvent: UserProfilePageEvent) {
    try {
      const { record_type, page_id, data_records } = userProfilePageEvent.data;
      const { organization_id, integration_id } = userProfilePageEvent.context;

      const processedResult = { department: {}, employee: {} };

      if (record_type === 'department') {
        processedResult.department =
          await this.departmentService.processRecords({
            pageId: page_id,
            organizationId: organization_id,
            integrationId: integration_id,
            departments: data_records,
          });
      } else if (record_type == 'employee') {
        processedResult.employee = await this.employeeService.processRecords({
          pageId: page_id,
          organizationId: organization_id,
          integrationId: integration_id,
          employees: data_records,
        });
      } else {
        throw new Error(
          `Invalid record type: ${record_type}, for page id: ${page_id}`,
        );
      }

      return processedResult;
    } catch (error) {
      this.logger.error(
        error,
        this.processPageEvent.name,
        UserProfileWorkflowProcessor.name,
      );
    }
  }
}
