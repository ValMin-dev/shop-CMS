import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	@Auth()
	@HttpCode(200)
	@Get('/')
	async getAllCategories() {
		return this.categoryService.getAllCategories()
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/:storeId/create')
	async createCategory(
		@Body() dto: CategoryDto,
		@Param('storeId') storeId: string
	) {
		return this.categoryService.createCategory(dto, storeId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/:categoryId')
	async getCategoryById(@Param('categoryId') categoryId: string) {
		return this.categoryService.getCategoryById(categoryId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/store/:storeId')
	async getCategoriesByStoreId(@Param('storeId') storeId: string) {
		return this.categoryService.getCategoriesByStoreId(storeId)
	}

	@Auth()
	@HttpCode(200)
	@Delete('/:categoryId/delete')
	async deleteCategory(@Param('categoryId') categoryId: string) {
		return this.categoryService.deleteCategory(categoryId)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/:categoryId/update')
	async updateCategory(
		@Param('categoryId') categoryId: string,
		@Body() dto: CategoryDto
	) {
		return this.categoryService.updateCategory(categoryId, dto)
	}
}
