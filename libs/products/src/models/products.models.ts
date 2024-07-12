import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IEntityBase } from '@stackbox/database';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export interface IProduct {
  name: string;
  description: string;
  logoUrl?: string;
  workspaceId: string;
}

export interface IProductEntity extends IEntityBase, IProduct {}

export class ProductCreateDto {
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

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  workspaceId: string;
}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}
