import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  LoggerModule,
  TraceIdMiddleware,
} from '@raksul/josys-commons/packages/logger';

import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  configuration as configVariable,
  configuration,
} from '../config/configuration';
import { EventStreamMockRmqModule } from './event-stream-mock-rmq/event-stream-mock-rmq.module';

const dynamicConfig = configVariable();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    LoggerModule.forRoot(
      {
        appName: dynamicConfig.app.name,
        sentryDNS: '',
        debugMode: dynamicConfig.error.sentry.debug_mode,
        isSentryEnable: dynamicConfig.error.sentry.enable,
        environment: dynamicConfig.ERROR_SENTRY_ENV,
        logLevel: [dynamicConfig.ERROR_SENTRY_LOG_LEVEL],
        // tracesSampleRate: 5,
        consoleOptions: {
          level: dynamicConfig.LOG_LEVEL,
        },
      },
      // LD_PROVIDER // uncomment the provider to enable the launch darkly in DRS
    ),
    DatabaseModule,
    EventStreamMockRmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
