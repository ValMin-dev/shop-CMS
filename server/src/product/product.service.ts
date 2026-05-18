import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from './dto/product.dto'
import { CurrentUser } from 'src/user/decorators/user.decorator'

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	private getSearchQuery(search?: string) {
		return this.prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: search,
							mode: 'insensitive'
						}
					},
					{
						description: {
							contains: search,
							mode: 'insensitive'
						}
					}
				]
			}
		})
	}

	async getAllProducts(search?: string) {
		if (search) {
			return this.getSearchQuery(search)
		}
		const products = await this.prisma.product.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				category: true,
				color: true,
				reviews: true
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Продукт не знайдений або відсутні продукти')
		}
		return products
	}
	async getProductById(id: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				id
			},
			include: {
				category: true,
				color: true,
				store: true,
				reviews: true
			}
		})
		if (!product) {
			throw new Error('Продукт не знайдений')
		}
		return product
	}
	async createProduct(dto: ProductDto, userId: string, storeId: string) {
		return this.prisma.product.create({
			data: {
				...dto,
				userId,
				storeId
			}
		})
	}
	async updateProduct(id: string, dto: ProductDto, userId: string) {
		const product = await this.getProductById(id)
		if (product.userId !== userId) {
			throw new Error('Ви не маєте прав на редагування цього продукту')
		}
		if (!product) {
			throw new Error('Продукт не знайдений')
		}
		return this.prisma.product.update({
			where: {
				id
			},
			data: {
				...dto
			}
		})
	}
	async deleteProduct(id: string, userId: string) {
		const product = await this.getProductById(id)
		if (!product) {
			throw new Error('Продукт не знайдений')
		}
		if (product.userId !== userId) {
			throw new Error('Ви не маєте прав на видалення цього продукту')
		}
		return this.prisma.product.delete({
			where: {
				id
			}
		})
	}
	async getProductsByCategoryId(categoryId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				id: categoryId
			},
			include: {
				category: true
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Продукти не знайдені для цієї категорії')
		}
		return products
	}
	async getProductsByStoreId(storeId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				storeId
			},
			include: {
				category: true,
				color: true
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Продукти не знайдені для цього магазину')
		}
		return products
	}
	async getProductsByColorId(colorId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				colorId
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Продукти не знайдені для цього кольору')
		}
		return products
	}
	async getProductsByUserId(userId: string) {
		const products = await this.prisma.product.findMany({
			where: {
				userId
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Продукти не знайдені для цього користувача')
		}
		return products
	}

	async getSimilarProducts(id: string) {
		const currentProduct = await this.getProductById(id)
		if (!currentProduct) {
			throw new Error('Продукт не знайдений')
		}
		const products = await this.prisma.product.findMany({
			where: {
				categoryId: currentProduct.categoryId,
				id: {
					not: id
				}
			},
			include: {
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		if (!products || products.length === 0) {
			throw new Error('Схожі продукти не знайдені')
		}
		return products
	}

	async getMostPopularProducts() {
		const mostPopularProducts = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			_count: { productId: true },
			orderBy: {
				_count: { productId: 'desc' }
			}
		})
		const productIds = mostPopularProducts
			.map(item => item.productId)
			.filter((productId): productId is string => productId !== null)
		if (productIds.length === 0) {
			throw new Error('Немає популярних продуктів')
		}
		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productIds
				}
			},
			include: {
				category: true
			}
		})
		return products
	}
}
