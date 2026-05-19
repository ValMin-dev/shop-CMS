import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OrderDto } from './dto/order.dto'
import { EnumOrderStatus } from '@prisma/client'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async createOrder(userId: string, dto: OrderDto) {
		if (!userId) {
			throw new Error('Користувач не знайдений')
		}
		if (!dto.items || dto.items.length === 0) {
			throw new Error('Замовлення повинно містити хоча б один товар')
		}

		const orderItems = await Promise.all(
			dto.items.map(async item => {
				const product = await this.prisma.product.findUnique({
					where: { id: item.productId },
					select: {
						price: true,
						storeId: true
					}
				})

				if (!product) {
					throw new Error(`Продукт ${item.productId} не знайдений`)
				}

				return {
					productId: item.productId,
					storeId: item.storeId ?? product.storeId,
					quantity: item.quantity,
					totalPrice: product.price * item.quantity
				}
			})
		)

		const totalPrice = orderItems.reduce((total, item) => {
			return total + item.totalPrice
		}, 0)

		const order = await this.prisma.order.create({
			data: {
				userId,
				totalPrice: totalPrice,
				status: 'PENDING',
				items: {
					create: orderItems
				}
			}
		})
		return order
	}

	async getAllOrders(userId: string) {
		if (!userId) {
			throw new Error('Користувач не знайдений')
		}
		const orders = await this.prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						product: true,
						store: true
					}
				}
			}
		})
		return orders
	}
}
