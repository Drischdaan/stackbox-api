import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestDataFactory } from '@stackbox/common/tests/factories';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import {
  IProductEntity,
  ProductCreateDto,
  ProductUpdateDto,
} from '../models/products.models';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<Repository<ProductEntity>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsService).compile();

    service = unit;
    repository = unitRef.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity) as string,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getPaginatedList', () => {
    it('should return a list of products', async () => {
      const expected: ProductEntity[] = TestDataFactory.Product.buildList(5);
      repository.find.mockResolvedValue(expected);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty list if no products are found', async () => {
      const expected: ProductEntity[] = [];
      repository.find.mockResolvedValue(expected);

      expect(await service.getPaginatedList()).toEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      const expected: ProductEntity = TestDataFactory.Product.build();
      repository.findOneBy.mockResolvedValue(expected);

      expect(await service.getById(expected.id)).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: expected.id });
    });

    it('should return null if no product is found', async () => {
      const expected: ProductEntity = null;
      repository.findOneBy.mockResolvedValue(expected);

      expect(await service.getById('invalid-id')).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'invalid-id' });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: ProductCreateDto = {
        name: 'Product Name',
        description: 'Product Description',
        logoUrl: 'Product Logo URL',
        workspaceId: 'workspace-id',
      };
      const expected: ProductEntity = TestDataFactory.Product.build({
        name: createDto.name,
        description: createDto.description,
        logoUrl: createDto.logoUrl,
        workspaceId: createDto.workspaceId,
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

    it('should return null if the product is not created', async () => {
      const createDto: ProductCreateDto = {
        name: 'Product Name',
        description: 'Product Description',
        logoUrl: 'Product Logo URL',
        workspaceId: 'workspace-id',
      };
      const expectedCreate: ProductEntity = TestDataFactory.Product.build({
        id: 'product-id',
        name: createDto.name,
        description: createDto.description,
        logoUrl: createDto.logoUrl,
        workspaceId: createDto.workspaceId,
      });
      const expected: IProductEntity = null;

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
    it('should update a product', async () => {
      const id = 'product-id';
      const updateDto: ProductUpdateDto = { name: 'New Name' };
      const expected: IProductEntity = TestDataFactory.Product.build({
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

    it('should return null if the product is not updated', async () => {
      const id = 'product-id';
      const updateDto: ProductUpdateDto = { name: 'New Name' };
      const expected: IProductEntity = null;

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
    it('should delete a product', async () => {
      const id = 'product-id';
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

    it('should return null if the product is not deleted', async () => {
      const id = 'product-id';
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
