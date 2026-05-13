import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { StoreDto } from './dto/store.dto'

@Injectable()
export class StoreService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		const stores = await this.prisma.store.findMany()
		if (!stores) {
			throw new Error('Магазини не знайдені')
		}

		return stores
	}
	async update(storeId: string, dto: StoreDto, userId: string) {
		const store = await this.prisma.store.findUnique({
			where: { id: storeId }
		})
		if (!store) {
			throw new Error('Магазин не знайдений')
		}
		if (store.userId !== userId) {
			throw new Error('Ви не маєте прав для оновлення цього магазину')
		}
		return this.prisma.store.update({
			where: { id: storeId },
			data: {
				name: dto.name ? dto.name : store.name,
				description: dto.description ? dto.description : store.description
			}
		})
	}

	async getMyStores(userId: string) {
		if (!userId) {
			throw new Error('Користувач не знайдений')
		}
		const user = await this.prisma.user.findUnique({
			where: { id: userId }
		})
		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		const stores = await this.prisma.store.findMany({
			where: { userId },
			include: {
				products: true
			}
		})
		if (!stores) {
			throw new Error('Магазини не знайдені')
		}
		return stores
	}

	async getById(storeId: string, userId: string) {
		const store = await this.prisma.store.findUnique({
			where: { id: storeId, userId },
			include: {
				products: true
			}
		})
		if (!store) {
			throw new Error(
				'Магазин не знайдений або ви не маєте прав для перегляду цього магазину'
			)
		}
		return store
	}

	async create(dto: StoreDto, userId: string) {
		if (!userId) {
			throw new Error('Користувач не знайдений')
		}
		const { name, description } = dto
		const desc = description ? description : 'Немає опису'

		const newStore = await this.prisma.store.create({
			data: {
				name,
				userId,
				description: desc
			}
		})
		if (!newStore) {
			throw new Error('Не вдалося створити магазин')
		}
		return newStore
	}

	async delete(storeId: string, userId: string) {
		const store = await this.prisma.store.findUnique({
			where: { id: storeId }
		})
		if (!store) {
			throw new Error('Магазин не знайдений')
		}
		if (store.userId !== userId) {
			throw new Error('Ви не маєте прав для видалення цього магазину')
		}
		return this.prisma.store.delete({
			where: { id: storeId }
		})
	}
}
