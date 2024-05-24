type UserProfilePageEventMetadata = {
  event_id: string;
  event_generated_at: Date;
  event_type: string;
  version: string;
};

type UserProfilePageEventContext = {
  organization_id: string;
  app_type: string;
  sync_entities: [string];
  integration_id: string;
};

type UserProfilePageEventData = {
  session_id: string;
  page_id: string;
  record_type: 'department' | 'employee';
  data_records: any[];
};

export class UserProfilePageEvent {
  metadata: UserProfilePageEventMetadata;
  context: UserProfilePageEventContext;
  data: UserProfilePageEventData;
}
