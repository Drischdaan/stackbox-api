import { TestBed } from '@automock/jest';
import { DeletionResult } from '@stackbox/common';
import { TestDataFactory } from '@stackbox/common/tests/factories';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto, ProductUpdateDto } from '../models/products.models';
import { ProductsService } from '../services/products.service';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsController).compile();

    controller = unit;
    service = unitRef.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getProductsList', () => {
    it('should return a list of products', async () => {
      const expected: ProductEntity[] = TestDataFactory.Product.buildList(5);

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getProductsList()).toEqual(expected);
      expect(service.getPaginatedList).toHaveBeenCalled();
    });

    it('should return an empty list if no products are found', async () => {
      const expected: ProductEntity[] = [];

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getProductsList()).toEqual(expected);
      expect(service.getPaginatedList).toHaveBeenCalled();
    });

    it('should return a list of products with pagination options', async () => {
      const expected: ProductEntity[] = TestDataFactory.Product.buildList(5);
      const paginationOptions = { limit: 10, page: 1 };

      service.getPaginatedList.mockResolvedValue(expected);

      expect(await controller.getProductsList(paginationOptions)).toEqual(
        expected,
      );
      expect(service.getPaginatedList).toHaveBeenCalledWith(paginationOptions);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const expected: ProductEntity = TestDataFactory.Product.build();

      service.getById.mockResolvedValue(expected);

      expect(await controller.getProductById(expected.id)).toEqual(expected);
      expect(service.getById).toHaveBeenCalledWith(expected.id);
    });

    it('should throw a NotFoundException if no product is found', async () => {
      const id = '1234';

      service.getById.mockResolvedValue(null);

      await expect(controller.getProductById(id)).rejects.toThrow(
        `Product with id ${id} not found`,
      );
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createDto: ProductCreateDto = {
        name: 'Product Name',
        description: 'Product Description',
        workspaceId: 'workspace-id',
      };
      const expected: ProductEntity = TestDataFactory.Product.build({
        name: createDto.name,
        description: createDto.description,
      });

      service.create.mockResolvedValue(expected);

      expect(await controller.createProduct(createDto)).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw a ConflictException if the product already exists', async () => {
      const createDto: ProductCreateDto = {
        name: 'Product Name',
        description: 'Product Description',
        workspaceId: 'workspace-id',
      };

      service.create.mockResolvedValue(null);

      await expect(controller.createProduct(createDto)).rejects.toThrow(
        `Product with name ${createDto.name} already exists`,
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateDto: ProductUpdateDto = {
        name: 'Product Name',
        description: 'Product Description',
      };
      const expected: ProductEntity = TestDataFactory.Product.build({
        name: updateDto.name,
        description: updateDto.description,
      });

      service.update.mockResolvedValue(expected);

      expect(await controller.updateProduct(expected.id, updateDto)).toEqual(
        expected,
      );
      expect(service.update).toHaveBeenCalledWith(expected.id, updateDto);
    });

    it('should throw a NotFoundException if no product is found', async () => {
      const id = '1234';
      const updateDto: ProductUpdateDto = {
        name: 'Product Name',
        description: 'Product Description',
      };

      service.update.mockResolvedValue(null);

      await expect(controller.updateProduct(id, updateDto)).rejects.toThrow(
        `Product with id ${id} not found`,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const expected: DeletionResult = { id: '1234' };

      service.delete.mockResolvedValue(expected);

      expect(await controller.deleteProduct(expected.id)).toEqual(expected);
      expect(service.delete).toHaveBeenCalledWith(expected.id);
    });

    it('should throw a NotFoundException if no product is found', async () => {
      const id = '1234';

      service.delete.mockResolvedValue(null);

      await expect(controller.deleteProduct(id)).rejects.toThrow(
        `Product with id ${id} not found`,
      );
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
