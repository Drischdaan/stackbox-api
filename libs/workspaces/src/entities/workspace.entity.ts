import { ApiProperty } from '@nestjs/swagger';
import { EntityBase } from '@stackbox/database';
import { Column, Entity } from 'typeorm';
import { IWorkspaceEntity } from '../models/workspaces.models';

@Entity('workspaces')
export class WorkspaceEntity extends EntityBase implements IWorkspaceEntity {
  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ length: 255 })
  @ApiProperty()
  description: string;

  @Column({ nullable: true, default: null })
  @ApiProperty({ nullable: true })
  logoUrl?: string;
}
