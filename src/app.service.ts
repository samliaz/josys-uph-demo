import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  statusCheck(): Record<string, string> {
    return { status: 'ok' };
  }
}
