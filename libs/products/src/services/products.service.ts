import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeletionResult, IPaginationInfo } from '@stackbox/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import {
  IPaginationOptions,
  validatePaginationOptions,
} from '../../../common/src/models/pagination.models';
import { ProductEntity } from '../entities/product.entity';
import {
  IProductEntity,
  ProductCreateDto,
  ProductUpdateDto,
} from '../models/products.models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async getCount(): Promise<number> {
    return await this.productsRepository.count();
  }

  async getPaginationInfo(
    paginationOptions: IPaginationOptions,
  ): Promise<IPaginationInfo> {
    const totalItems: number = await this.getCount();
    return {
      totalItems,
      totalPages: Math.ceil(totalItems / paginationOptions.limit) - 1,
    };
  }

  async getPaginatedList(
    paginationOptions?: IPaginationOptions,
  ): Promise<IProductEntity[]> {
    paginationOptions = validatePaginationOptions(paginationOptions);
    return await this.productsRepository.find({
      take: paginationOptions.limit,
      skip: paginationOptions.limit * paginationOptions.page,
    });
  }

  async getList(): Promise<IProductEntity[]> {
    return await this.productsRepository.find();
  }

  async getById(id: string): Promise<IProductEntity | null> {
    return await this.productsRepository.findOneBy({ id });
  }

  async create(createDto: ProductCreateDto): Promise<IProductEntity | null> {
    delete createDto.workspaceId;
    const result: InsertResult = await this.productsRepository
      .createQueryBuilder()
      .insert()
      .values(this.productsRepository.create(createDto))
      .orIgnore()
      .returning('*')
      .execute();
    if (result.raw.length === 0) return null;
    return result.raw[0];
  }

  async update(
    id: string,
    updateDto: ProductUpdateDto,
  ): Promise<IProductEntity | null> {
    const result: UpdateResult = await this.productsRepository
      .createQueryBuilder()
      .update()
      .set(updateDto)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    if (result.affected == 0) return null;
    return result.raw[0];
  }

  async delete(id: string): Promise<DeletionResult | null> {
    const result: DeleteResult = await this.productsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    if (result.affected == 0) return null;
    return { id };
  }
}
