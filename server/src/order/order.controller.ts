import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { OrderService } from './order.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { OrderDto } from './dto/order.dto'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Auth()
	@UsePipes(ValidationPipe)
	@HttpCode(200)
	@Post('/create')
	async createOrder(@CurrentUser('id') userId: string, @Body() dto: OrderDto) {
		return this.orderService.createOrder(userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Get('/all')
	getAllOrders(@CurrentUser('id') userId: string) {
		return this.orderService.getAllOrders(userId)
	}
}
