import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiPaginatedOkResponse,
  DeletionResult,
  ExceptionResult,
  PaginationOptionsDto,
} from '@stackbox/common';
import { PaginationDto } from '../../../common/src/models/pagination.models';
import { WorkspaceEntity } from '../entities/workspace.entity';
import {
  IWorkspaceEntity,
  WorkspaceCreateDto,
  WorkspaceUpdateDto,
} from '../models/workspaces.models';
import { WorkspacesService } from '../services/workspaces.service';

@Controller('workspaces')
@ApiTags('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiPaginatedOkResponse(WorkspaceEntity)
  async getWorkspacesList(
    @Query() paginationOptions?: PaginationOptionsDto,
  ): Promise<PaginationDto<IWorkspaceEntity>> {
    return await this.workspacesService.getPaginatedList(paginationOptions);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: WorkspaceEntity })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async getWorkspaceById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IWorkspaceEntity> {
    const workspace: IWorkspaceEntity | null =
      await this.workspacesService.getById(id);
    if (workspace === null)
      throw new NotFoundException(`Workspace with id ${id} not found`);
    return workspace;
  }

  @Post()
  @ApiOkResponse({ type: WorkspaceEntity })
  @ApiConflictResponse({ type: ExceptionResult })
  async createWorkspace(
    @Body() createDto: WorkspaceCreateDto,
  ): Promise<IWorkspaceEntity> {
    const workspace: IWorkspaceEntity | null =
      await this.workspacesService.create(createDto);
    if (workspace === null)
      throw new ConflictException(
        `Workspace with name ${createDto.name} already exists`,
      );
    return workspace;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: WorkspaceEntity })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async updateWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: WorkspaceUpdateDto,
  ): Promise<IWorkspaceEntity> {
    const workspace: IWorkspaceEntity | null =
      await this.workspacesService.update(id, updateDto);
    if (workspace === null)
      throw new NotFoundException(`Workspace with id ${id} not found`);
    return workspace;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: DeletionResult })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async deleteWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeletionResult> {
    const result: DeletionResult | null =
      await this.workspacesService.delete(id);
    if (result === null)
      throw new NotFoundException(`Workspace with id ${id} not found`);
    return result;
  }
}
