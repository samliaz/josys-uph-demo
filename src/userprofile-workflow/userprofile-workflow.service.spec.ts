import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@raksul/josys-commons/packages/logger';

import { DepartmentService } from 'src/department/department.service';
import { EmployeeService } from 'src/employee/employee.service';
import { ExternalDepartmentService } from 'src/event-stream-mock-rmq/services/external-department.service';
import { UserProfilePageEvent } from './dto/userprofile-page-event.dto';
import { TestDataHelper } from './testDataSeeder';
import { UserProfileWorkflowProcessor } from './userprofile-workflow-processor.service';

describe('IntegrationEventProcessorService', () => {
  let service: UserProfileWorkflowProcessor;
  let departmentService: DepartmentService;
  const externalDepartmentServiceMock = {
    getDepartmentsBySessionId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LoggerService,
          useValue: { setContext: jest.fn(), info: jest.fn() },
        },
        {
          provide: ExternalDepartmentService,
          useValue: externalDepartmentServiceMock,
        },
        {
          provide: DepartmentService,
          useValue: { processRecords: jest.fn() },
        },
        {
          provide: EmployeeService,
          useValue: { processRecords: jest.fn() },
        },
        UserProfileWorkflowProcessor,
      ],
    }).compile();

    service = module.get<UserProfileWorkflowProcessor>(
      UserProfileWorkflowProcessor,
    );
    departmentService = module.get<DepartmentService>(DepartmentService);
  });

  // it('should persist departments for an integration id into the core database upon receiving the integration completed event', () => {
  //   const icEvent: IntegrationCompletedEvent = {
  //     metadata: {
  //       event_id: 'unique identifier for the sync',
  //       event_generated_at: '',
  //       event_type: '',
  //     },
  //     context: {
  //       organization_id: '',
  //       integration_id: '',
  //     },
  //     data: {
  //       session_id: '',
  //     },
  //   };

  //   const testDatahelper = new TestDataHelper(icEvent);
  //   const seedMongoDepartments = testDatahelper.seedMongoDepartments();

  //   service.process(icEvent);

  //   const result = testDatahelper.getMysqlDepartments();
  //   expect(result.count).toEqual(seedMongoDepartments.count);
  // });

  it('should call departmentService.processRecords with correct parameters', async () => {
    const externalDepartments = [
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
    const eventMessage: UserProfilePageEvent = {
      metadata: {
        event_id: 'unique identifier for the sync',
        event_generated_at: new Date(),
        event_type: 'FETCH',
        version: '1.0',
      },
      context: {
        organization_id: '1536',
        integration_id: '3123',
        app_type: 'office365',
        sync_entities: ['employees'],
      },
      data: {
        page_id: '1',
        session_id: 'session_00',
        record_type: 'department',
        data_records: externalDepartments,
      },
    };
    const mockProcessRecords = jest
      .fn()
      .mockResolvedValue({ success: 10, failed: 0 });
    jest
      .spyOn(departmentService, 'processRecords')
      .mockImplementation(mockProcessRecords);

    await service.processPageEvent(eventMessage);

    expect(departmentService.processRecords).toHaveBeenCalledWith({
      pageId: '1',
      organizationId: '1536',
      integrationId: '3123',
      departments: externalDepartments,
    });
  });

  it.skip('should persist user profiles for an integration id into the core database upon receiving the integration completed event', () => {
    const icEvent: UserProfilePageEvent = {
      metadata: {
        event_id: 'unique identifier for the sync',
        event_generated_at: new Date(),
        event_type: '',
        version: '',
      },
      context: {
        organization_id: '',
        integration_id: '',
        app_type: '',
        sync_entities: [''],
      },
      data: {
        page_id: '1',
        session_id: '',
        record_type: 'department',
        data_records: [],
      },
    };

    const testDatahelper = new TestDataHelper(icEvent);
    const seedMongoDepartments = testDatahelper.seedMongoUserProfiles();

    service.processPageEvent(icEvent);

    const result = testDatahelper.getMysqlUserProfiles();
    expect(result.count).toEqual(seedMongoDepartments.count);
  });
});
