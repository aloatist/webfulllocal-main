import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './product.entity';
import { TagEntity } from '../tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, TagEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
