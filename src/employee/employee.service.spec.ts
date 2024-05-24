import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@raksul/josys-commons/packages/logger';
import { EmployeeService } from './employee.service';
import { EmployeeSQLRepository } from './repositories/employee.sql.repository';
import { EmployeePage } from './dto/externalEmployeeProfile.dto';
import { Employee } from '@prisma/mongo/client';

describe('EmployeeService', () => {
  let service: EmployeeService;
  const sqlRepoMock = {
    findEmployeeByEmployeeCode: jest.fn(),
    updateEmployeeById: jest.fn(),
    createEmployee: jest.fn(),
  };

  const employee: Employee = {
    id: 'emp-1',
    session_id: 'session_59',
    page_number: 1,
    organization_id: '123',
    integration_id: '456',
    external_id: '',
    employee_code: '9990',
    departments: [],
    employment_status: '',
    last_name: 'doe',
    first_name: 'john',
    email: '',
    location: {
      telephone: '9879695975',
      address: 'address123',
    },
    personal_email: '',
    title: '',
    joined_on: '',
    resigned_on: '',
    employment_type: '',
  };

  const icEvent: EmployeePage = {
    pageId: '1',
    organizationId: 'org_1',
    integrationId: 'int_1',
    employees: [employee],
  };

  const sqlEmployee = {
    employee_id: 1234567890,
    organization_id: 123n,
    employee_ledger_integration_id: 456n,
    employee_code: '9990',
    employment_status: 0,
    last_name: 'doe',
    first_name: 'john',
    email: '',
    personal_email: '',
    title: '',
    joined_on: null,
    resigned_on: null,
    employment_type: 0,
    status: null,
    username: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: EmployeeSQLRepository, useValue: sqlRepoMock },
        {
          provide: LoggerService,
          useValue: { setContext: jest.fn(), info: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should create employee for an event id if its not already exists', async () => {
    sqlRepoMock.findEmployeeByEmployeeCode.mockResolvedValueOnce(null);

    sqlRepoMock.createEmployee.mockResolvedValueOnce({
      sqlUserProfile: sqlEmployee,
    } as any);

    const now = jest.spyOn(Date, 'now').mockReturnValue(1234567890);

    const resp = await service.processRecords(icEvent);

    expect(resp).toEqual({
      created: 1,
      errorList: [],
      failedCount: 0,
      successCount: 1,
      updated: 0,
    });

    expect(sqlRepoMock.findEmployeeByEmployeeCode).toHaveBeenCalledWith('9990');
    expect(sqlRepoMock.createEmployee).toHaveBeenCalledWith(sqlEmployee);
    expect(sqlRepoMock.updateEmployeeById).toHaveBeenCalledTimes(0);
    now.mockRestore();
  });

  it('should update employee for an event id if its already exists', async () => {
    sqlRepoMock.findEmployeeByEmployeeCode.mockResolvedValueOnce({
      ...sqlEmployee,
      id: '9990',
    });

    const resp = await service.processRecords(icEvent);

    expect(resp).toEqual({
      created: 0,
      errorList: [],
      failedCount: 0,
      successCount: 1,
      updated: 1,
    });

    expect(sqlRepoMock.findEmployeeByEmployeeCode).toHaveBeenCalledWith('9990');
    expect(sqlRepoMock.updateEmployeeById).toHaveBeenCalledWith('9990', {
      ...sqlEmployee,
      employee_id: 1234567890n,
    });
  });
});
