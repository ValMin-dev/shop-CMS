import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Delete,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ProductService } from './product.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ProductDto } from './dto/product.dto'
import { CurrentUser } from 'src/user/decorators/user.decorator'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(200)
	@Get('/')
	async getAllProducts(@Query('search') search?: string) {
		return this.productService.getAllProducts(search)
	}

	@HttpCode(200)
	@Get('/:id')
	async getProductById(@Param('id') id: string) {
		return this.productService.getProductById(id)
	}

	@HttpCode(200)
	@Get('/:id/similar')
	async getSimilarProducts(@Param('id') id: string) {
		return this.productService.getSimilarProducts(id)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@Put('/:id/update')
	async updateProduct(
		@Param('id') id: string,
		@Body() dto: ProductDto,
		@CurrentUser('id') userId: string
	) {
		return this.productService.updateProduct(id, dto, userId)
	}

	@Auth()
	@HttpCode(200)
	@Delete('/:id/delete')
	async deleteProduct(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.productService.deleteProduct(id, userId)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@Post('/:storeId/create')
	async createProduct(
		@CurrentUser('id') userId: string,
		@Param('storeId') storeId: string,
		@Body() dto: ProductDto
	) {
		return this.productService.createProduct(dto, userId, storeId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/category/:categoryId')
	async getProductsByCategoryId(@Param('categoryId') categoryId: string) {
		return this.productService.getProductsByCategoryId(categoryId)
	}
	@Auth()
	@HttpCode(200)
	@Get('/user/:userId')
	async getProductsByUserId(@Param('userId') userId: string) {
		return this.productService.getProductsByUserId(userId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/category/:categoryId/popular')
	async getMostPopularProducts() {
		return this.productService.getMostPopularProducts()
	}

	@Auth()
	@HttpCode(200)
	@Get('/store/:storeId')
	async getProductsByStoreId(@Param('storeId') storeId: string) {
		return this.productService.getProductsByStoreId(storeId)
	}
	@Auth()
	@HttpCode(200)
	@Get('/color/:colorId')
	async getProductsByColorId(@Param('colorId') colorId: string) {
		return this.productService.getProductsByColorId(colorId)
	}
}
