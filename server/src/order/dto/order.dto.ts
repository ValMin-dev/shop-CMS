import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsString } from 'class-validator'

export class OrderDto {
	@IsArray({ message: 'Замовлення повинно містити масив товарів' })
	@Type(() => OrderItemDto)
	items!: OrderItemDto[]
}

export class OrderItemDto {
	@IsString()
	productId!: string

	@IsNumber()
	quantity!: number

	@IsNumber()
	totalPrice!: number

	@IsString()
	storeId?: string
}
