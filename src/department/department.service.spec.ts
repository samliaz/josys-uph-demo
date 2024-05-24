import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '@prisma/mongo/client';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { DepartmentsSQLRepository } from './repositories/department.sql.repository';
import { CommonSQLRepository } from './repositories/common.sql.repository';
import { DepartmentService } from './department.service';
import { DepartmentPage } from './dto/department-page.dto';

describe('DepartmentService', () => {
  let departmentService: DepartmentService;
  const departmentSQLRepoMock = {
    findDepartmentByOrganizationAndExternalId: jest.fn(),
    createDepartment: jest.fn(),
    updateDepartmentById: jest.fn(),
  };
  const commonSQLRepoMock = {
    findIntegrationsByOrganizationId: jest.fn(),
    findSoftwaresById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        { provide: DepartmentsSQLRepository, useValue: departmentSQLRepoMock },
        { provide: CommonSQLRepository, useValue: commonSQLRepoMock },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    departmentService = module.get<DepartmentService>(DepartmentService);
  });

  beforeEach(() => {
    departmentSQLRepoMock.findDepartmentByOrganizationAndExternalId.mockReset();
    departmentSQLRepoMock.createDepartment.mockReset();
    departmentSQLRepoMock.updateDepartmentById.mockReset();
    commonSQLRepoMock.findIntegrationsByOrganizationId.mockReset();
    commonSQLRepoMock.findSoftwaresById.mockReset();
  });

  it('should create department records when it is not present in the core sql db', async () => {
    const externalDepartments: Department[] = [
      {
        id: 'id-1',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '000',
        integration_id: '000',
        external_id: '000',
        name: 'department-1',
        position: 'position',
        parent: null,
        code: null,
      },
      {
        id: 'id-2',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '000',
        integration_id: '000',
        external_id: '000',
        name: 'department-2',
        position: 'position',
        parent: null,
        code: null,
      },
    ];
    const departmentSessionData: DepartmentPage = {
      pageId: '1',
      organizationId: '123',
      integrationId: '789',
      departments: externalDepartments,
    };
    const dataSourceId = '1';
    const dataSourceKey = 'gsuite';
    commonSQLRepoMock.findIntegrationsByOrganizationId.mockResolvedValue({
      id: dataSourceId,
    });
    commonSQLRepoMock.findSoftwaresById.mockResolvedValue({
      key: dataSourceKey,
    });
    departmentSQLRepoMock.findDepartmentByOrganizationAndExternalId.mockResolvedValue(
      null,
    );

    const processedResult = await departmentService.processRecords(
      departmentSessionData,
    );

    expect(processedResult).toEqual({
      pageId: '1',
      departmentCreated: 2,
      departmentUpdated: 0,
      errorList: [],
      failedCount: 0,
      successCount: 2,
    });
    expect(departmentSQLRepoMock.createDepartment).toHaveBeenNthCalledWith(1, {
      organization_id: 123n,
      name: 'department-1',
      department_code: null,
      external_department_id: 'id-1',
      data_source: 1,
      display_order: 1,
      parent_id: null,
    });
    expect(departmentSQLRepoMock.createDepartment).toHaveBeenNthCalledWith(2, {
      organization_id: 123n,
      name: 'department-2',
      department_code: null,
      external_department_id: 'id-2',
      data_source: 1,
      display_order: 1,
      parent_id: null,
    });
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenCalledTimes(0);
  });

  it('should update department records when it is already present in the core sql db', async () => {
    const externalDepartments: Department[] = [
      {
        id: 'id-1',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '000',
        integration_id: '000',
        external_id: '000',
        name: 'department-1',
        position: 'position',
        parent: null,
        code: null,
      },
      {
        id: 'id-2',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '000',
        integration_id: '000',
        external_id: '000',
        name: 'department-2',
        position: 'position',
        parent: null,
        code: null,
      },
    ];
    const departmentSessionData: DepartmentPage = {
      pageId: '1',
      organizationId: '123',
      integrationId: '789',
      departments: externalDepartments,
    };
    const coreDepartmentRecord1 = {
      id: 1,
      organization_id: 0,
      name: 'department-1',
      department_code: null,
      external_department_id: 'id-1',
      data_source: 1,
      display_order: 1,
    };
    const coreDepartmentRecord2 = {
      id: 2,
      organization_id: 0,
      name: 'department-2',
      department_code: null,
      external_department_id: 'id-2',
      data_source: 1,
      display_order: 1,
    };
    const dataSourceId = '1';
    const dataSourceKey = 'gsuite';
    commonSQLRepoMock.findIntegrationsByOrganizationId.mockResolvedValue({
      id: dataSourceId,
    });
    commonSQLRepoMock.findSoftwaresById.mockResolvedValue({
      key: dataSourceKey,
    });
    departmentSQLRepoMock.findDepartmentByOrganizationAndExternalId
      .mockResolvedValueOnce(coreDepartmentRecord1)
      .mockResolvedValueOnce(coreDepartmentRecord2);

    const processedResult = await departmentService.processRecords(
      departmentSessionData,
    );

    expect(processedResult).toEqual({
      pageId: '1',
      departmentCreated: 0,
      departmentUpdated: 2,
      errorList: [],
      failedCount: 0,
      successCount: 2,
    });
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenCalledTimes(2);
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenNthCalledWith(
      1,
      1,
      {
        organization_id: 123n,
        name: 'department-1',
        department_code: null,
        external_department_id: 'id-1',
        data_source: 1,
        display_order: 1,
        parent_id: null,
      },
    );
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenNthCalledWith(
      2,
      2,
      {
        organization_id: 123n,
        name: 'department-2',
        department_code: null,
        external_department_id: 'id-2',
        data_source: 1,
        display_order: 1,
        parent_id: null,
      },
    );
    expect(departmentSQLRepoMock.createDepartment).toHaveBeenCalledTimes(0);
  });

  it('should update Parent Department if it already exists in core database ', async () => {
    const externalDepartments: Department[] = [
      {
        id: 'id-1',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '123',
        integration_id: '789',
        external_id: '000',
        name: 'department-1',
        position: 'position',
        parent: {
          id: 'id-3',
          name: 'Sales',
          code: '101',
          position: '10',
        },
        code: null,
      },
    ];
    const departmentSessionData: DepartmentPage = {
      pageId: '1',
      organizationId: '123',
      integrationId: '789',
      departments: externalDepartments,
    };
    const coreDepartment = {
      id: 1,
      organization_id: '123',
      name: 'department-1',
      department_code: null,
      external_department_id: 'id-1',
      data_source: 1,
      display_order: 1,
    };
    const coreParentDepartment = {
      id: 2,
      organization_id: '123',
      name: 'Sales-department',
      department_code: '101',
      external_department_id: 'id-3',
      data_source: 1,
      display_order: 1,
    };
    const dataSourceId = '1';
    const dataSourceKey = 'gsuite';
    commonSQLRepoMock.findIntegrationsByOrganizationId.mockResolvedValue({
      id: dataSourceId,
    });
    commonSQLRepoMock.findSoftwaresById.mockResolvedValue({
      key: dataSourceKey,
    });
    departmentSQLRepoMock.findDepartmentByOrganizationAndExternalId
      .mockResolvedValueOnce(coreDepartment)
      .mockResolvedValueOnce(coreParentDepartment);
    departmentSQLRepoMock.updateDepartmentById
      .mockResolvedValueOnce({ id: coreParentDepartment.id })
      .mockResolvedValueOnce({ id: coreDepartment.id });

    const processedResult = await departmentService.processRecords(
      departmentSessionData,
    );

    expect(processedResult).toEqual({
      pageId: '1',
      departmentCreated: 0,
      departmentUpdated: 1,
      errorList: [],
      failedCount: 0,
      successCount: 1,
    });
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenCalledTimes(2);
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenNthCalledWith(
      1,
      coreParentDepartment.id,
      {
        organization_id: 123n,
        name: 'Sales',
        department_code: '101',
        external_department_id: 'id-3',
        data_source: 1,
        display_order: 10,
      },
    );
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenNthCalledWith(
      2,
      coreDepartment.id,
      {
        organization_id: 123n,
        name: 'department-1',
        department_code: null,
        external_department_id: 'id-1',
        data_source: 1,
        display_order: 1,
        parent_id: 2,
      },
    );
    expect(departmentSQLRepoMock.createDepartment).toHaveBeenCalledTimes(0);
  });

  it('should create parent department records when it is not present in the core database', async () => {
    const externalDepartments: Department[] = [
      {
        id: 'id-1',
        session_id: 'session-1',
        page_Int: 1,
        organization_id: '123',
        integration_id: '789',
        external_id: '000',
        name: 'Marketing',
        position: '1',
        parent: {
          id: 'id-3',
          name: 'Sales',
          code: '102',
          position: '10',
        },
        code: '101',
      },
    ];
    const departmentSessionData: DepartmentPage = {
      pageId: '1',
      organizationId: '123',
      integrationId: '789',
      departments: externalDepartments,
    };
    const coreDepartment = {
      id: 2,
      organization_id: '123',
      name: 'Marketing',
      department_code: '101',
      external_department_id: 'id-1',
      data_source: 1,
      display_order: 1,
    };
    const dataSourceId = '1';
    const dataSourceKey = 'gsuite';
    commonSQLRepoMock.findIntegrationsByOrganizationId.mockResolvedValue({
      id: dataSourceId,
    });
    commonSQLRepoMock.findSoftwaresById.mockResolvedValue({
      key: dataSourceKey,
    });
    departmentSQLRepoMock.findDepartmentByOrganizationAndExternalId.mockResolvedValueOnce(
      coreDepartment,
    );
    departmentSQLRepoMock.updateDepartmentById.mockResolvedValueOnce({
      id: coreDepartment.id,
    });
    const mockParentID = 99;
    departmentSQLRepoMock.createDepartment.mockResolvedValueOnce({
      id: mockParentID,
    });

    const processedResult = await departmentService.processRecords(
      departmentSessionData,
    );

    expect(processedResult).toEqual({
      pageId: '1',
      departmentCreated: 0,
      departmentUpdated: 1,
      errorList: [],
      failedCount: 0,
      successCount: 1,
    });
    expect(departmentSQLRepoMock.createDepartment).toHaveBeenNthCalledWith(1, {
      organization_id: 123n,
      name: 'Sales',
      department_code: '102',
      external_department_id: 'id-3',
      data_source: 1,
      display_order: 10,
    });
    expect(departmentSQLRepoMock.updateDepartmentById).toHaveBeenNthCalledWith(
      1,
      coreDepartment.id,
      {
        organization_id: 123n,
        name: 'Marketing',
        department_code: '101',
        external_department_id: 'id-1',
        data_source: 1,
        display_order: 1,
        parent_id: mockParentID,
      },
    );
  });
});
