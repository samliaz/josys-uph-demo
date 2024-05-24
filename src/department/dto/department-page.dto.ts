import { Department } from '@prisma/mongo/client';

export class DepartmentPage {
  pageId: string;
  organizationId: string;
  integrationId: string;
  departments: Department[];
}
