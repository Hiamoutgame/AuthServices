import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  checkConnection(port: string): string {
    return `Connection to port ${port} is successful!`;
  }
}
