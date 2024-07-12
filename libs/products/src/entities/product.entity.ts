import { ApiProperty } from '@nestjs/swagger';
import { EntityBase } from '@stackbox/database';
import { IWorkspaceEntity } from '@stackbox/workspaces';
import { WorkspaceEntity } from '@stackbox/workspaces/entities/workspace.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IProductEntity } from '../models/products.models';

@Entity('products')
export class ProductEntity extends EntityBase implements IProductEntity {
  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ length: 255 })
  @ApiProperty()
  description: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ nullable: true })
  logoUrl?: string;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspaceId' })
  workspace: IWorkspaceEntity;

  @Column()
  workspaceId: string;
}
