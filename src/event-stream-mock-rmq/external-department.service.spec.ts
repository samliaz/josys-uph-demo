import { Test, TestingModule } from '@nestjs/testing';
import { Department } from '@prisma/mongo/client';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { ExternalDepartmentService } from './services/external-department.service';
import { ExternalDepartmentsRepository } from './repositories/external-department.repository';

describe('ExternalDepartmentService', () => {
  let externalDepartmentService: ExternalDepartmentService;
  const externalDepartmentRepoMock = { findDepartmentsBySessionId: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalDepartmentService,
        {
          provide: ExternalDepartmentsRepository,
          useValue: externalDepartmentRepoMock,
        },
        {
          provide: LoggerService,
          useValue: { setContext: jest.fn(), info: jest.fn() },
        },
      ],
    }).compile();

    externalDepartmentService = module.get<ExternalDepartmentService>(
      ExternalDepartmentService,
    );
  });

  beforeEach(() => {
    externalDepartmentRepoMock.findDepartmentsBySessionId.mockReset();
  });

  it('should get external departments when session id is given', async () => {
    const sessionId = 'session-1';
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
    externalDepartmentRepoMock.findDepartmentsBySessionId.mockResolvedValue(
      externalDepartments,
    );

    const response =
      await externalDepartmentService.getDepartmentsBySessionId(sessionId);

    expect(response).toEqual(externalDepartments);
    expect(
      externalDepartmentRepoMock.findDepartmentsBySessionId,
    ).toHaveBeenCalledWith(sessionId);
    expect(
      externalDepartmentRepoMock.findDepartmentsBySessionId,
    ).toHaveBeenCalledTimes(1);
  });
});
