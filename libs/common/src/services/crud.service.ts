import { Injectable } from '@nestjs/common';
import { EntityBase } from '@stackbox/database';
import { DeepPartial, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeletionResult } from '../models/deletion.models';
import {
  IPaginationOptions,
  PaginationDto,
  validatePaginationOptions,
} from '../models/pagination.models';

@Injectable()
export abstract class CrudService<TEntity extends EntityBase> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  async getList(
    options: IPaginationOptions = { page: 0, limit: 0 },
  ): Promise<TEntity[]> {
    options = validatePaginationOptions(options);
    return this.repository.find({
      skip: options.page * options.limit,
      take: options.limit,
    });
  }

  async getPaginatedList(
    options?: IPaginationOptions,
  ): Promise<PaginationDto<TEntity>> {
    options = validatePaginationOptions(options);
    const [items, totalItems] = await this.repository.findAndCount({
      skip: options.page * options.limit,
      take: options.limit,
    });
    return {
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / options.limit) - 1,
      },
      items,
    };
  }

  async getById(id: string): Promise<TEntity | null> {
    const entity: TEntity = await this.repository
      .createQueryBuilder()
      .select()
      .where({ id })
      .getOne();
    return entity;
  }

  async create<CreateDto extends DeepPartial<TEntity>>(
    createDto: CreateDto,
  ): Promise<TEntity> {
    const queryResult: InsertResult = await this.repository
      .createQueryBuilder()
      .insert()
      .values(
        this.repository.create(createDto) as QueryDeepPartialEntity<TEntity>,
      )
      .returning('*')
      .execute();
    if (queryResult.raw.length === 0) return null;
    return queryResult.raw[0];
  }

  async update<UpdateDto extends DeepPartial<TEntity>>(
    id: string,
    updateDto: UpdateDto,
  ): Promise<TEntity> {
    const queryResult = await this.repository
      .createQueryBuilder()
      .update()
      .set(updateDto as QueryDeepPartialEntity<TEntity>)
      .where({ id })
      .returning('*')
      .execute();
    if (queryResult.affected === 0) return null;
    return queryResult.raw[0];
  }

  async delete(id: string): Promise<DeletionResult> {
    const queryResult = await this.repository
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();
    if (queryResult.affected === 0) return null;
    return { id };
  }
}
