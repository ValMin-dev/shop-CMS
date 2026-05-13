import {
	Controller,
	Get,
	HttpCode,
	ValidationPipe,
	UsePipes,
	Post,
	Body,
	Param,
	Delete,
	Put
} from '@nestjs/common'
import { StoreService } from './store.service'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { StoreDto } from './dto/store.dto'

@Controller('stores')
export class StoreController {
	constructor(private readonly storeService: StoreService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('/')
	async getAll() {
		const stores = await this.storeService.getAll()
		return stores
	}
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create')
	async create(@Body() dto: StoreDto, @CurrentUser('id') userId: string) {
		const uniqueStore = await this.storeService.getAll()
		if (uniqueStore.some(store => store.name === dto.name)) {
			throw new Error('Магазин з такою назвою вже існує')
		}

		return this.storeService.create(dto, userId)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('/my')
	async getMyStores(@CurrentUser('id') userId: string) {
		return this.storeService.getMyStores(userId)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('/:id')
	async getById(
		@Param('id') storeId: string,
		@CurrentUser('id') userId: string
	) {
		return this.storeService.getById(storeId, userId)
	}
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/:id/update')
	async update(
		@Param('id') storeId: string,
		@Body() dto: StoreDto,
		@CurrentUser('id') userId: string
	) {
		return this.storeService.update(storeId, dto, userId)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('/:id/delete')
	async delete(
		@Param('id') storeId: string,
		@CurrentUser('id') userId: string
	) {
		return this.storeService.delete(storeId, userId)
	}
}
