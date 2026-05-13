import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'
@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllCategories() {
		const categories = await this.prisma.category.findMany()
		if (!categories || categories.length === 0) {
			throw new Error('Категорія не знайдена або відсутні категорії')
		}
		return categories
	}
	async getCategoriesByStoreId(storeId: string) {
		const categories = await this.prisma.category.findMany({
			where: {
				storeId
			}
		})
		if (!categories || categories.length === 0) {
			throw new Error('Категорії не знайдені для цього магазину')
		}
		return categories
	}
	async getCategoryById(id: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				id
			}
		})
		if (!category) {
			throw new Error('Категорія не знайдена')
		}
		return category
	}
	async createCategory(dto: CategoryDto, storeId: string) {
		const uniqueCategory = await this.prisma.category.findFirst({
			where: {
				name: dto.name,
				storeId
			}
		})
		if (uniqueCategory) {
			throw new Error('Категорія з такою назвою вже існує для цього магазину')
		}
		return this.prisma.category.create({
			data: {
				...dto,
				storeId
			}
		})
	}
	async updateCategory(id: string, dto: CategoryDto) {
		const category = await this.getCategoryById(id)
		if (!category) {
			throw new Error('Категорія не знайдена')
		}
		return this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name || category.name,
				description: dto.description || category.description
			}
		})
	}
	async deleteCategory(id: string) {
		const category = await this.getCategoryById(id)
		if (!category) {
			throw new Error('Категорія не знайдена')
		}
		return this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
