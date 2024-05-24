import { Module } from '@nestjs/common';

import { DepartmentModule } from 'src/department/department.module';
import { UserProfileWorkflowProcessor } from './userprofile-workflow-processor.service';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [DepartmentModule, EmployeeModule],
  providers: [UserProfileWorkflowProcessor],
  exports: [UserProfileWorkflowProcessor],
})
export class UserProfileWorkflowModule {}
