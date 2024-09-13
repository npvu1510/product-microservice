import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { PrismaClient } from '@prisma/client';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  // public products: Product[] = [];
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connection established');
  }

  create(createProductDto: CreateProductDto) {
    const { name, price, description } = createProductDto;
    // const newProduct = new Product(name, price, description);

    // this.products.push(newProduct);
    // return newProduct;

    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDTO) {
    // return this.products;

    const { page = 1, limit = 3 } = paginationDto;
    const totalItems = await this.product.count();

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metaData: {
        page: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });

    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return await this.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // await this.product.delete({ where: { id: id } });

    return await this.product.update({
      where: { id: id },
      data: { available: false },
    });
  }
}
