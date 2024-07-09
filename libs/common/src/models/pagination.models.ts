import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export const PAGINATION_DEFAULT_PAGE: number = 0;
export const PAGINATION_DEFAULT_LIMIT: number = 10;

export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

export class PaginationOptionsDto implements IPaginationOptions {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiProperty({ required: false })
  limit?: number;
}

export const DEFAULT_PAGINATION_OPTIONS: IPaginationOptions = {
  page: PAGINATION_DEFAULT_PAGE,
  limit: PAGINATION_DEFAULT_LIMIT,
};

export function validatePaginationOptions(
  options?: IPaginationOptions,
): IPaginationOptions {
  if (!options) return DEFAULT_PAGINATION_OPTIONS;
  return { ...DEFAULT_PAGINATION_OPTIONS, ...options };
}
