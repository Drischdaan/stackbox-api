import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';

export class PingResponse {
  @ApiProperty()
  ping: 'pong';
}

@Controller()
@ApiTags('app')
export class AppController {
  @Get()
  @ApiOkResponse({ type: PingResponse })
  getPing(): PingResponse {
    return { ping: 'pong' };
  }
}
