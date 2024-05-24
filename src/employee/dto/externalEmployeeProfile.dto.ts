import { Employee } from '@prisma/mongo/client';

type Location = {
  address: string;
  telephone: string;
};

export class ExternalEmployeeProfile {
  session_id: string;
  page_number: number;
  organization_id: string;
  integration_id: string;
  external_id: string;
  employee_code: string;
  departments: string[];
  employment_status: string;
  last_name: string;
  first_name: string;
  email: string;
  personal_email: string;
  location: Location;
  title: string;
  joined_on: string;
  resigned_on: string;
  employment_type: string;
}

export class EmployeePage {
  pageId: string;
  organizationId: string;
  integrationId: string;
  employees: Employee[];
}
