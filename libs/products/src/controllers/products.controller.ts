import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  DeletionResult,
  ExceptionResult,
  IPaginationInfo,
  PaginationInfoDto,
  PaginationOptionsDto,
} from '@stackbox/common';
import { ProductEntity } from '../entities/product.entity';
import {
  IProductEntity,
  ProductCreateDto,
  ProductUpdateDto,
} from '../models/products.models';
import { ProductsService } from '../services/products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({ type: [ProductEntity] })
  async getProductsList(
    @Query() paginationOptions?: PaginationOptionsDto,
  ): Promise<IProductEntity[]> {
    return await this.productsService.getPaginatedList(paginationOptions);
  }

  @Get('list/info')
  @ApiOkResponse({ type: PaginationInfoDto })
  async getProductsListInfo(
    @Query() paginationOptions?: PaginationOptionsDto,
  ): Promise<IPaginationInfo> {
    return await this.productsService.getPaginationInfo(paginationOptions);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IProductEntity> {
    const product: IProductEntity | null =
      await this.productsService.getById(id);
    if (product === null)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  @Post()
  @ApiOkResponse({ type: ProductEntity })
  @ApiConflictResponse({ type: ExceptionResult })
  async createProduct(
    @Body() createDto: ProductCreateDto,
  ): Promise<IProductEntity> {
    const product: IProductEntity | null =
      await this.productsService.create(createDto);
    if (product === null)
      throw new ConflictException(
        `Product with name ${createDto.name} already exists`,
      );
    return product;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: ProductUpdateDto,
  ): Promise<IProductEntity> {
    const product: IProductEntity | null = await this.productsService.update(
      id,
      updateDto,
    );
    if (product === null)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: DeletionResult })
  @ApiNotFoundResponse({ type: ExceptionResult })
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeletionResult> {
    const result: DeletionResult | null = await this.productsService.delete(id);
    if (result === null)
      throw new NotFoundException(`Product with id ${id} not found`);
    return result;
  }
}
