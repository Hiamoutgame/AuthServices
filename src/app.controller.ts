import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('check-connection')
  checkConnection(): string {
    const port = process.env.PORT ?? '3000';
    return this.appService.checkConnection(port);
  }
}
