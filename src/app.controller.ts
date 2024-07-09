import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from '@stackbox/workspaces/services/workspaces.service';

export class PingResponse {
  @ApiProperty()
  ping: 'pong';
}

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOkResponse({ type: PingResponse })
  getPing(): PingResponse {
    this.workspacesService.create({ name: 'Test', description: 'test' });
    this.workspacesService.update('0ee64c5f-897a-4a4e-a4cc-27746e235dc7', {
      name: 'Test2',
      description: 'test',
    });
    return { ping: 'pong' };
  }
}
