import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
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
});
