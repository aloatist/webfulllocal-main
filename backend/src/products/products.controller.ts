import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { presentProduct } from './product.presenter';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Permissions('product.read')
  async findAll(@Query() query: ProductQueryDto) {
    const { data, total } = await this.productsService.findAll(query);
    return {
      data: data.map(presentProduct),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('product.read')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    return presentProduct(product);
  }

  @Post()
  @Permissions('product.write')
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return presentProduct(product);
  }

  @Patch(':id')
  @Permissions('product.write')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productsService.update(id, dto);
    return presentProduct(product);
  }

  @Delete(':id')
  @Permissions('product.write')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { success: true };
  }
}
