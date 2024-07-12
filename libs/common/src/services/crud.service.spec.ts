import { TestBed } from '@automock/jest';
import { Injectable } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DEFAULT_PAGINATION_OPTIONS,
  PaginationDto,
} from '../models/pagination.models';
import { TestDataFactory, TestEntity } from '../tests/factories';
import { CrudService } from './crud.service';

@Injectable()
class TestCrudService extends CrudService<TestEntity> {
  constructor(
    @InjectRepository(TestEntity)
    repository: Repository<TestEntity>,
  ) {
    super(repository);
  }
}

describe('CrudService', () => {
  let service: TestCrudService;
  let repository: jest.Mocked<Repository<TestEntity>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TestCrudService).compile();

    service = unit;
    repository = unitRef.get(getRepositoryToken(TestEntity) as string);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getPaginatedList', () => {
    it('should return a list of test entities', async () => {
      const count: number = 5;
      const expected: PaginationDto<TestEntity> = {
        meta: {
          totalItems: count,
          totalPages: Math.ceil(count / DEFAULT_PAGINATION_OPTIONS.limit) - 1,
        },
        items: TestDataFactory.Test.buildList(count),
      };
      repository.findAndCount.mockResolvedValueOnce([expected.items, count]);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.findAndCount).toHaveBeenCalled();
    });

    it('should return an empty list if no test entities are found', async () => {
      const count: number = 0;
      const expected: PaginationDto<TestEntity> = {
        meta: {
          totalItems: count,
          totalPages: Math.ceil(count / DEFAULT_PAGINATION_OPTIONS.limit) - 1,
        },
        items: [],
      };
      repository.findAndCount.mockResolvedValueOnce([expected.items, count]);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a test entity by id', async () => {
      const expected: TestEntity = TestDataFactory.Test.build();

      const createQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(expected),
      };
      repository.createQueryBuilder.mockReturnValueOnce(
        createQueryBuilder as any,
      );

      expect(await service.getById(expected.id)).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.select).toHaveBeenCalled();
      expect(createQueryBuilder.where).toHaveBeenCalledWith({
        id: expected.id,
      });
      expect(createQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null if no test entity is found', async () => {
      const expected: TestEntity = null;

      const createQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(expected),
      };
      repository.createQueryBuilder.mockReturnValueOnce(
        createQueryBuilder as any,
      );

      expect(await service.getById('invalid-id')).toEqual(expected);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.select).toHaveBeenCalled();
      expect(createQueryBuilder.where).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
      expect(createQueryBuilder.getOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new test entity', async () => {
      const createDto = {
        name: 'Name',
        description: 'Description',
      };
      const expected: TestEntity = TestDataFactory.Test.build({
        name: createDto.name,
        description: createDto.description,
      });

      repository.create.mockReturnValue(expected);

      const createQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [expected] }),
      };
      repository.createQueryBuilder.mockReturnValue(createQueryBuilder as any);

      expect(await service.create(createDto)).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.insert).toHaveBeenCalled();
      expect(createQueryBuilder.values).toHaveBeenCalledWith(expected);
      expect(createQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the test entity is not created', async () => {
      const createDto = {
        name: 'Name',
        description: 'Description',
      };
      const expectedCreate: TestEntity = TestDataFactory.Test.build({
        id: 'test-id',
        name: createDto.name,
        description: createDto.description,
      });
      const expected: TestEntity | null = null;

      repository.create.mockReturnValue(expectedCreate);

      const createQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [] }),
      };
      repository.createQueryBuilder.mockReturnValue(createQueryBuilder as any);

      expect(await service.create(createDto)).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(createQueryBuilder.insert).toHaveBeenCalled();
      expect(createQueryBuilder.values).toHaveBeenCalledWith(expectedCreate);
      expect(createQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a test entity', async () => {
      const id = 'test-id';
      const updateDto = { name: 'New Name' };
      const expected: TestEntity = TestDataFactory.Product.build({
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
      expect(updateQueryBuilder.where).toHaveBeenCalledWith({ id });
      expect(updateQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the test entity is not updated', async () => {
      const id = 'test-id';
      const updateDto = { name: 'New Name' };
      const expected: TestEntity | null = null;

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
      expect(updateQueryBuilder.where).toHaveBeenCalledWith({ id });
      expect(updateQueryBuilder.returning).toHaveBeenCalledWith('*');
      expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a test entity', async () => {
      const id = 'test-id';
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
      expect(deleteQueryBuilder.where).toHaveBeenCalledWith({ id });
      expect(deleteQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should return null if the test entity is not deleted', async () => {
      const id = 'test-id';
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
      expect(deleteQueryBuilder.where).toHaveBeenCalledWith({ id });
      expect(deleteQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
