import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeletionResult,
  IPaginationOptions,
  validatePaginationOptions,
} from '@stackbox/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { WorkspaceEntity } from '../entities/workspace.entity';
import {
  IWorkspaceEntity,
  WorkspaceCreateDto,
  WorkspaceUpdateDto,
} from '../models/workspaces.models';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspacesRepository: Repository<WorkspaceEntity>,
  ) {}

  async getCount(): Promise<number> {
    return await this.workspacesRepository.count();
  }

  async getPaginatedList(
    paginationOptions?: IPaginationOptions,
  ): Promise<IWorkspaceEntity[]> {
    paginationOptions = validatePaginationOptions(paginationOptions);
    return await this.workspacesRepository.find({
      take: paginationOptions.limit,
      skip: paginationOptions.limit * paginationOptions.page,
    });
  }

  async getList(): Promise<IWorkspaceEntity[]> {
    return await this.workspacesRepository.find();
  }

  async getById(id: string): Promise<IWorkspaceEntity | null> {
    return await this.workspacesRepository.findOneBy({ id });
  }

  async create(
    createDto: WorkspaceCreateDto,
  ): Promise<IWorkspaceEntity | null> {
    const result: InsertResult = await this.workspacesRepository
      .createQueryBuilder()
      .insert()
      .values(this.workspacesRepository.create(createDto))
      .orIgnore()
      .returning('*')
      .execute();
    if (result.raw.length === 0) return null;
    return result.raw[0];
  }

  async update(
    id: string,
    updateDto: WorkspaceUpdateDto,
  ): Promise<IWorkspaceEntity | null> {
    const result: UpdateResult = await this.workspacesRepository
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
    const result: DeleteResult = await this.workspacesRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    if (result.affected == 0) return null;
    return { id };
  }
}
