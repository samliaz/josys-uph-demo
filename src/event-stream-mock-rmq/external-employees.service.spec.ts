import { Test, TestingModule } from '@nestjs/testing';
import { Employee } from '@prisma/mongo/client';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { ExternalEmployeeService } from './services/external-employees.service';
import { ExternalEmployeeRepository } from './repositories/external-employee.repository';

describe('ExternalEmployeeService', () => {
  let externalEmployeeService: ExternalEmployeeService;
  const externalEmployeeRepoMock = { fetchEmployeeProfiles: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalEmployeeService,
        {
          provide: ExternalEmployeeRepository,
          useValue: externalEmployeeRepoMock,
        },
        {
          provide: LoggerService,
          useValue: { setContext: jest.fn(), info: jest.fn() },
        },
      ],
    }).compile();

    externalEmployeeService = module.get<ExternalEmployeeService>(
      ExternalEmployeeService,
    );
  });

  beforeEach(() => {
    externalEmployeeRepoMock.fetchEmployeeProfiles.mockReset();
  });

  it('should get external employees when session id is given', async () => {
    const sessionId = 'session-1';
    const externalEmployees: Employee[] = [
      {
        id: 'emp-1',
        session_id: 'session_59',
        page_number: 1,
        organization_id: '123',
        integration_id: '456',
        external_id: '',
        employee_code: '876',
        departments: [],
        employment_status: 'employeed',
        last_name: 'doe',
        first_name: 'old john',
        email: 'john@doe.com',
        location: {
          telephone: '9879695975',
          address: 'address123',
        },
        personal_email: '',
        title: 'dev',
        joined_on: '',
        resigned_on: '',
        employment_type: '',
      },
      {
        id: 'emp-2',
        session_id: 'session_59',
        page_number: 1,
        organization_id: '123',
        integration_id: '456',
        external_id: '',
        employee_code: '876',
        departments: [],
        employment_status: 'employeed',
        last_name: 'doe',
        first_name: 'old john',
        email: 'john@doe.com',
        location: {
          telephone: '9879695975',
          address: 'address123',
        },
        personal_email: '',
        title: 'dev',
        joined_on: '',
        resigned_on: '',
        employment_type: '',
      },
    ];
    externalEmployeeRepoMock.fetchEmployeeProfiles.mockResolvedValue(
      externalEmployees,
    );

    const response =
      await externalEmployeeService.fetchEmployeeProfiles(sessionId);

    expect(response).toEqual(externalEmployees);
    expect(externalEmployeeRepoMock.fetchEmployeeProfiles).toHaveBeenCalledWith(
      sessionId,
    );
    expect(
      externalEmployeeRepoMock.fetchEmployeeProfiles,
    ).toHaveBeenCalledTimes(1);
  });
});
