import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IEntityBase } from '@stackbox/database';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export interface IWorkspace {
  name: string;
  description: string;
  logoUrl?: string;
}

export interface IWorkspaceEntity extends IEntityBase, IWorkspace {}

export class WorkspaceCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  @ApiProperty({ required: false })
  logoUrl?: string;
}

export class WorkspaceUpdateDto extends PartialType(WorkspaceCreateDto) {}
