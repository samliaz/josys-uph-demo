import { ConfirmChannel } from 'amqplib';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  LoggerService,
  TraceIdMiddleware,
} from '@raksul/josys-commons/packages/logger';
import { ConfigService } from '@nestjs/config';

import { UserProfileEventAdaptor } from 'src/event-stream-mock-rmq/services/userprofile-event-adaptor.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;

  constructor(
    private readonly eventProcessor: UserProfileEventAdaptor,
    private readonly logger: LoggerService,
    private readonly traceContext: TraceIdMiddleware,
    private readonly config: ConfigService,
  ) {
    const connection = amqp.connect([config.get('AMP_QUEUE_URL')]);
    this.channelWrapper = connection.createChannel();
    this.logger.setContext('RabbitMQConsumer');
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('uph_info_queue', { durable: true });
        await channel.consume('uph_info_queue', async (message) => {
          try {
            if (message) {
              const UPIntegrationCompletedEvent = JSON.parse(
                message.content.toString(),
              );

              this.traceContext.use(UPIntegrationCompletedEvent);

              await this.eventProcessor.processEvent(
                UPIntegrationCompletedEvent,
              );

              channel.ack(message);
            }
          } catch (err) {
            console.log(err);
            this.logger.error(
              err,
              this.onModuleInit.name,
              ConsumerService.name,
            );
          }
        });
      });
      this.logger.info(
        'Consumer service started and listening for messages.',
        this.onModuleInit.name,
        ConsumerService.name,
      );
    } catch (err) {
      this.logger.error(err, this.onModuleInit.name, ConsumerService.name);
    }
  }
}
