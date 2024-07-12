import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@stackbox/common/services/crud.service';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from '../entities/workspace.entity';

@Injectable()
export class WorkspacesService extends CrudService<WorkspaceEntity> {
  constructor(
    @InjectRepository(WorkspaceEntity)
    repository: Repository<WorkspaceEntity>,
  ) {
    super(repository);
  }
}
