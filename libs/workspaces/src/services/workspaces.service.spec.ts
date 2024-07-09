import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestDataFactory } from '@stackbox/common/tests/factories';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from '../entities/workspace.entity';
import {
  IWorkspaceEntity,
  WorkspaceCreateDto,
  WorkspaceUpdateDto,
} from '../models/workspaces.models';
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

  describe('getPaginatedList', () => {
    it('should return a list of workspaces', async () => {
      const expected: IWorkspaceEntity[] =
        TestDataFactory.Workspace.buildList(5);
      repository.find.mockResolvedValue(expected);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty list if no workspaces are found', async () => {
      const expected: IWorkspaceEntity[] = [];
      repository.find.mockResolvedValue(expected);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a workspace by id', async () => {
      const expected: IWorkspaceEntity = TestDataFactory.Workspace.build();
      repository.findOneBy.mockResolvedValue(expected);

      expect(await service.getById(expected.id)).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: expected.id });
    });

    it('should return null if no workspace is found', async () => {
      const expected: IWorkspaceEntity = null;
      repository.findOneBy.mockResolvedValue(expected);

      expect(await service.getById('invalid-id')).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'invalid-id' });
    });
  });

  describe('create', () => {
    it('should create a new workspace', async () => {
      const createDto: WorkspaceCreateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };
      const expected: IWorkspaceEntity = TestDataFactory.Workspace.build({
        name: createDto.name,
        description: createDto.description,
      });

      repository.create.mockReturnValue(expected);

      const createQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [expected] }),
      };
      repository.createQueryBuilder.mockReturnValue(createQueryBuilder as any);

      expect(await service.create(createDto)).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.insert).toHaveBeenCalled();
      expect(createQueryBuilder.values).toHaveBeenCalledWith(expected);
      expect(createQueryBuilder.orIgnore).toHaveBeenCalled();
      expect(createQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the workspace is not created', async () => {
      const createDto: WorkspaceCreateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };
      const expectedCreate: IWorkspaceEntity = TestDataFactory.Workspace.build({
        name: createDto.name,
        description: createDto.description,
      });
      const expected: IWorkspaceEntity = null;

      repository.create.mockReturnValue(expectedCreate);

      const createQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [] }),
      };
      repository.createQueryBuilder.mockReturnValue(createQueryBuilder as any);

      expect(await service.create(createDto)).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.insert).toHaveBeenCalled();
      expect(createQueryBuilder.values).toHaveBeenCalledWith(expectedCreate);
      expect(createQueryBuilder.orIgnore).toHaveBeenCalled();
      expect(createQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a workspace', async () => {
      const id = 'workspace-id';
      const updateDto: WorkspaceUpdateDto = { name: 'New Name' };
      const expected: IWorkspaceEntity = TestDataFactory.Workspace.build({
        id,
        name: updateDto.name,
      });

      const updateQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [expected], affected: 1 }),
      };
      repository.createQueryBuilder.mockReturnValue(updateQueryBuilder as any);

      expect(await service.update(id, updateDto)).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(updateQueryBuilder.update).toHaveBeenCalled();
      expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateDto);
      expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(updateQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the workspace is not updated', async () => {
      const id = 'workspace-id';
      const updateDto: WorkspaceUpdateDto = { name: 'New Name' };
      const expected: IWorkspaceEntity = null;

      const updateQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [], affected: 0 }),
      };
      repository.createQueryBuilder.mockReturnValue(updateQueryBuilder as any);

      expect(await service.update(id, updateDto)).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(updateQueryBuilder.update).toHaveBeenCalled();
      expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateDto);
      expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(updateQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a workspace', async () => {
      const id = 'workspace-id';
      const expected: { id: string } | null = { id };

      const deleteQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      repository.createQueryBuilder.mockReturnValue(deleteQueryBuilder as any);

      expect(await service.delete(id)).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(deleteQueryBuilder.delete).toHaveBeenCalled();
      expect(deleteQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(deleteQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the workspace is not deleted', async () => {
      const id = 'workspace-id';
      const expected: { id: string } | null = null;

      const deleteQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 0 }),
      };
      repository.createQueryBuilder.mockReturnValue(deleteQueryBuilder as any);

      expect(await service.delete(id)).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(deleteQueryBuilder.delete).toHaveBeenCalled();
      expect(deleteQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id });
      expect(deleteQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
