import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { PrismaService } from 'src/prisma.service'
import { EnumOrderStatus } from '@prisma/client'
dayjs.locale('uk')

const monthNames = [
	'Січ',
	'Лют',
	'Бер',
	'Кві',
	'Тра',
	'Чер',
	'Лип',
	'Сер',
	'Вер',
	'Жов',
	'Лис',
	'Гру'
]

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	async getMainStatistics(storeId: string) {
		const ordersCount = await this.ordersCount(storeId)
		const revenueTotal = await this.getRevenueTotal(storeId)
		const productsCount = await this.productsCount(storeId)
		const categoriesCount = await this.categoriesCount(storeId)
		const reviewsCount = await this.reviewsCount(storeId)
		const averageRating = await this.averageRating(storeId)
		const bestSellingProducts = await this.getBestSellingProducts(storeId)
		const ordersByMonth = await this.getOrdersByMonth(storeId)
		const revenueByMonth = await this.getRevenueByMonth(storeId)

		return [
			{ id: 1, name: 'Кількість замовлень', value: ordersCount },
			{ id: 8, name: 'Замовлення по місяцях', value: ordersByMonth },
			{ id: 2, name: 'Загальний дохід', value: revenueTotal },
			{ id: 9, name: 'Дохід по місяцях', value: revenueByMonth },
			{ id: 3, name: 'Кількість товарів', value: productsCount },
			{ id: 4, name: 'Кількість категорій', value: categoriesCount },
			{ id: 5, name: 'Кількість відгуків', value: reviewsCount },
			{ id: 6, name: 'Середній рейтинг', value: averageRating },
			{ id: 7, name: 'Найпродаваніші товари', value: bestSellingProducts }
		]
	}

	async getMiddleStatistics(storeId: string) {
		const bestSellingProducts = await this.popularProductsThisMonth(storeId)
		const lastUsers = await this.getLastUsers(storeId)
		const thisMonthStats = await this.getThisMonthStatistics(storeId)
		return [
			{ id: 3, name: 'Найпродаваніші товари', value: bestSellingProducts },
			{ id: 4, name: 'Останні користувачі', value: lastUsers },
			{
				id: 5,
				name: 'Замовлення цього місяця',
				value: thisMonthStats.ordersCount
			},
			{ id: 6, name: 'Дохід цього місяця', value: thisMonthStats.totalRevenue }
		]
	}

	async getLastUsers(storeId: string) {
		const users = await this.prisma.user.findMany({
			where: {
				stores: {
					some: {
						id: storeId
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 5
		})
		return users
	}
	async getThisMonthStatistics(storeId: string) {
		const startOfMonth = dayjs().startOf('month').toDate()
		const endOfMonth = dayjs().endOf('month').toDate()
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				},
				createdAt: {
					gte: startOfMonth,
					lte: endOfMonth
				},
				status: EnumOrderStatus.CANCELED
			},
			select: {
				totalPrice: true,
				createdAt: true
			}
		})
		const totalRevenue = orders.reduce((total, order) => {
			return total + order.totalPrice
		}, 0)
		const ordersCount = orders.length
		return {
			totalRevenue,
			ordersCount
		}
	}
	async popularProductsThisMonth(storeId: string) {
		const startOfMonth = dayjs().startOf('month').toDate()
		const endOfMonth = dayjs().endOf('month').toDate()
		const orderItems = await this.prisma.orderItem.findMany({
			where: {
				storeId,
				order: {
					createdAt: {
						gte: startOfMonth,
						lte: endOfMonth
					},
					status: EnumOrderStatus.CANCELED
				}
			},
			select: {
				productId: true,
				quantity: true,
				product: {
					select: {
						name: true,
						price: true
					}
				}
			}
		})
		if (orderItems.length === 0) {
			return []
		}

		const productSales = orderItems.reduce(
			(acc, item) => {
				if (!acc[item.productId!]) {
					acc[item.productId!] = {
						name: item.product!.name,
						price: item.product!.price,
						quantity: 0
					}
				}
				acc[item.productId!].quantity += item.quantity
				return acc
			},
			{} as Record<string, { name: string; price: number; quantity: number }>
		)
		const bestSellingProducts = Object.entries(productSales)
			.map(([productId, data]) => ({
				productId,
				name: data.name,
				price: data.price,
				quantity: data.quantity
			}))
			.sort((a, b) => b.quantity - a.quantity)
		return bestSellingProducts
	}

	async getOrdersByMonth(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				}
			},
			select: {
				createdAt: true
			}
		})
		const ordersByMonth = monthNames.map((month, index) => {
			const count = orders.filter(
				order => dayjs(order.createdAt).month() === index
			).length
			return {
				month,
				count
			}
		})
		return ordersByMonth
	}
	async getRevenueTotal(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				},
				status: EnumOrderStatus.CANCELED
			},
			select: {
				totalPrice: true
			}
		})
		const totalRevenue = orders.reduce((total, order) => {
			return total + order.totalPrice
		}, 0)
		return totalRevenue
	}
	async getRevenueByMonth(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				},
				status: EnumOrderStatus.CANCELED
			},
			select: {
				totalPrice: true,
				createdAt: true
			}
		})
		const revenueByMonth = monthNames.map((month, index) => {
			const total = orders
				.filter(order => dayjs(order.createdAt).month() === index)
				.reduce((sum, order) => sum + order.totalPrice, 0)
			return {
				month,
				total
			}
		})
		return revenueByMonth
	}

	async salesByDate(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				},
				status: EnumOrderStatus.CANCELED
			},
			select: {
				totalPrice: true,
				createdAt: true
			}
		})
		const salesByDate = orders.reduce(
			(acc, order) => {
				const date = dayjs(order.createdAt).format('YYYY-MM-DD')
				if (!acc[date]) {
					acc[date] = 0
				}
				acc[date] += order.totalPrice
				return acc
			},
			{} as Record<string, number>
		)
		return Object.entries(salesByDate).map(([date, total]) => ({
			date,
			total
		}))
	}

	async categoriesCount(storeId: string) {
		const categories = await this.prisma.category.findMany({
			where: {
				storeId
			},
			select: {
				id: true
			}
		})
		return categories.length
	}
	async productsCount(storeId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				storeId
			},
			select: {
				id: true
			}
		})
		return products.length
	}

	async ordersCount(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						storeId
					}
				}
			},
			select: {
				id: true
			}
		})
		return orders.length
	}

	async reviewsCount(storeId: string) {
		const reviews = await this.prisma.review.findMany({
			where: {
				storeId
			},
			select: {
				id: true
			}
		})
		return reviews.length
	}

	async averageRating(storeId: string) {
		const reviews = await this.prisma.review.findMany({
			where: {
				storeId
			},
			select: {
				rating: true
			}
		})
		if (reviews.length === 0) {
			return 0
		}
		const average =
			reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
		return average
	}

	async getBestSellingProducts(storeId: string) {
		const orderItems = await this.prisma.orderItem.findMany({
			where: {
				storeId
			},
			select: {
				productId: true,
				quantity: true,
				product: {
					select: {
						name: true,
						price: true
					}
				}
			}
		})
		if (orderItems.length === 0) {
			return []
		}

		const productSales = orderItems.reduce(
			(acc, item) => {
				if (!acc[item.productId!]) {
					acc[item.productId!] = {
						name: item.product!.name,
						price: item.product!.price,
						quantity: 0
					}
				}
				acc[item.productId!].quantity += item.quantity
				return acc
			},
			{} as Record<string, { name: string; price: number; quantity: number }>
		)
		const bestSellingProducts = Object.entries(productSales)
			.map(([productId, data]) => ({
				productId,
				name: data.name,
				price: data.price,
				quantity: data.quantity
			}))
			.sort((a, b) => b.quantity - a.quantity)
		return bestSellingProducts
	}
}
