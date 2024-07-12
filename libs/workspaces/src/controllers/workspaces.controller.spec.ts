import { TestBed } from '@automock/jest';
import { DeletionResult } from '@stackbox/common';
import { TestDataFactory } from '@stackbox/common/tests/factories';
import { WorkspaceEntity } from '../entities/workspace.entity';
import {
  WorkspaceCreateDto,
  WorkspaceUpdateDto,
} from '../models/workspaces.models';
import { WorkspacesService } from '../services/workspaces.service';
import { WorkspacesController } from './workspaces.controller';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;
  let service: jest.Mocked<WorkspacesService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(WorkspacesController).compile();

    controller = unit;
    service = unitRef.get<WorkspacesService>(WorkspacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getWorkspacesList', () => {
    it('should return a list of workspaces', async () => {
      const expected: WorkspaceEntity[] =
        TestDataFactory.Workspace.buildList(5);

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getWorkspacesList()).toEqual(expected);
      expect(service.getPaginatedList).toHaveBeenCalled();
    });

    it('should return an empty list if no workspaces are found', async () => {
      const expected: WorkspaceEntity[] = [];

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getWorkspacesList()).toEqual(expected);
      expect(service.getPaginatedList).toHaveBeenCalled();
    });

    it('should return a list of workspaces with pagination options', async () => {
      const expected: WorkspaceEntity[] =
        TestDataFactory.Workspace.buildList(5);
      const paginationOptions = { limit: 10, page: 1 };

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getWorkspacesList(paginationOptions)).toEqual(
        expected,
      );
      expect(service.getPaginatedList).toHaveBeenCalledWith(paginationOptions);
    });
  });

  describe('getWorkspaceById', () => {
    it('should return a workspace by id', async () => {
      const expected: WorkspaceEntity = TestDataFactory.Workspace.build();

      service.getById.mockResolvedValue(expected);

      expect(await controller.getWorkspaceById(expected.id)).toEqual(expected);
      expect(service.getById).toHaveBeenCalledWith(expected.id);
    });

    it('should throw a NotFoundException if no workspace is found', async () => {
      const id = '1234';

      service.getById.mockResolvedValue(null);

      await expect(controller.getWorkspaceById(id)).rejects.toThrow(
        `Workspace with id ${id} not found`,
      );
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('createWorkspace', () => {
    it('should create a new workspace', async () => {
      const createDto: WorkspaceCreateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };
      const expected: WorkspaceEntity = TestDataFactory.Workspace.build({
        name: createDto.name,
        description: createDto.description,
      });

      service.create.mockResolvedValue(expected);

      expect(await controller.createWorkspace(createDto)).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw a ConflictException if the workspace already exists', async () => {
      const createDto: WorkspaceCreateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };

      service.create.mockResolvedValue(null);

      await expect(controller.createWorkspace(createDto)).rejects.toThrow(
        `Workspace with name ${createDto.name} already exists`,
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateWorkspace', () => {
    it('should update a workspace', async () => {
      const updateDto: WorkspaceUpdateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };
      const expected: WorkspaceEntity = TestDataFactory.Workspace.build({
        name: updateDto.name,
        description: updateDto.description,
      });

      service.update.mockResolvedValue(expected);

      expect(await controller.updateWorkspace(expected.id, updateDto)).toEqual(
        expected,
      );
      expect(service.update).toHaveBeenCalledWith(expected.id, updateDto);
    });

    it('should throw a NotFoundException if no workspace is found', async () => {
      const id = '1234';
      const updateDto: WorkspaceUpdateDto = {
        name: 'Workspace Name',
        description: 'Workspace Description',
      };

      service.update.mockResolvedValue(null);

      await expect(controller.updateWorkspace(id, updateDto)).rejects.toThrow(
        `Workspace with id ${id} not found`,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      const expected: DeletionResult = { id: '1234' };

      service.delete.mockResolvedValue(expected);

      expect(await controller.deleteWorkspace(expected.id)).toEqual(expected);
      expect(service.delete).toHaveBeenCalledWith(expected.id);
    });

    it('should throw a NotFoundException if no workspace is found', async () => {
      const id = '1234';

      service.delete.mockResolvedValue(null);

      await expect(controller.deleteWorkspace(id)).rejects.toThrow(
        `Workspace with id ${id} not found`,
      );
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
