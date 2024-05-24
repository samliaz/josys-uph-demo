type EventMetadata = {
  event_id: string;
  event_generated_at: Date;
  event_type: string;
  version: string;
};

type EventContext = {
  organization_id: string;
  app_type: string;
  sync_entities: [string];
  integration_id: string;
};

type EventData = {
  session_id: string;
};

export class IntegrationCompletedEvent {
  metadata: EventMetadata;
  context: EventContext;
  data: EventData;
}
