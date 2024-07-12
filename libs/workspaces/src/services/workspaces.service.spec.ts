import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let repository: jest.Mocked<Repository<WorkspaceEntity>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(WorkspacesService).compile();

    service = unit;
    repository = unitRef.get<Repository<WorkspaceEntity>>(
      getRepositoryToken(WorkspaceEntity) as string,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
