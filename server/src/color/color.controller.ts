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
import { ColorService } from './color.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ColorDto } from './dto/color.dto'

@Controller('colors')
export class ColorController {
	constructor(private readonly colorService: ColorService) {}
	@Auth()
	@HttpCode(200)
	@Get('/')
	async getAllColors() {
		return this.colorService.getAllColors()
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/:storeId/create')
	async createColor(@Body() dto: ColorDto, @Param('storeId') storeId: string) {
		return this.colorService.createColor(dto, storeId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/:colorId')
	async getColorById(@Param('colorId') colorId: string) {
		return this.colorService.getColorById(colorId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/store/:storeId')
	async getColorsByStoreId(@Param('storeId') storeId: string) {
		return this.colorService.getColorsByStoreId(storeId)
	}

	@Auth()
	@HttpCode(200)
	@Delete('/:colorId/delete')
	async deleteColor(@Param('colorId') colorId: string) {
		return this.colorService.deleteColor(colorId)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/:colorId/update')
	async updateColor(@Param('colorId') colorId: string, @Body() dto: ColorDto) {
		return this.colorService.updateColor(colorId, dto)
	}
}
