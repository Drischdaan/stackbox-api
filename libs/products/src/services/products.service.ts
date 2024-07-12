import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@stackbox/common/services/crud.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { IProductEntity } from '../models/products.models';

@Injectable()
export class ProductsService extends CrudService<IProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    repository: Repository<ProductEntity>,
  ) {
    super(repository);
  }
}
