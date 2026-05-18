import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ReviewDto } from './dto/review.dto'

@Injectable()
export class ReviewService {
	constructor(private readonly prisma: PrismaService) {}

	async createReview(userId: string, productId: string, dto: ReviewDto) {
		if (userId === undefined || productId === undefined) {
			throw new Error('Невірні дані для створення відгуку')
		}

		const getStore = await this.prisma.product.findUnique({
			where: { id: productId },
			select: { storeId: true }
		})
		return this.prisma.review.create({
			data: {
				...dto,
				userId,
				productId,
				storeId: getStore?.storeId
			}
		})
	}

	async updateReview(reviewId: string, userId: string, dto: ReviewDto) {
		const existingReview = await this.prisma.review.findUnique({
			where: { id: reviewId }
		})
		if (!existingReview) {
			throw new Error('Відгук не знайдений')
		}
		if (existingReview.userId !== userId) {
			throw new Error('Ви не можете редагувати цей відгук')
		}
		return this.prisma.review.update({
			where: { id: reviewId },
			data: {
				...dto
			}
		})
	}

	async getReviewsByProductId(productId: string) {
		return this.prisma.review.findMany({
			where: { productId },
			include: {
				user: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async deleteReview(reviewId: string, userId: string) {
		const review = await this.prisma.review.findUnique({
			where: { id: reviewId }
		})
		if (!review) {
			throw new Error('Відгук не знайдений')
		}
		if (review.userId !== userId) {
			throw new Error('Ви не можете видалити цей відгук')
		}
		await this.prisma.review.delete({
			where: { id: reviewId }
		})
		return { message: 'Відгук успішно видалений' }
	}

	async getReviewById(reviewId: string) {
		const review = await this.prisma.review.findUnique({
			where: { id: reviewId },
			include: {
				user: true
			}
		})
		if (!review) {
			throw new Error('Відгук не знайдений')
		}
		return review
	}
}
