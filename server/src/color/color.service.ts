import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ColorDto } from './dto/color.dto'

@Injectable()
export class ColorService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllColors() {
		const colors = await this.prisma.color.findMany()
		if (!colors || colors.length === 0) {
			throw new Error('Колір не знайдений або відсутні кольори')
		}
		return colors
	}
	async getColorsByStoreId(storeId: string) {
		const colors = await this.prisma.color.findMany({
			where: {
				storeId
			}
		})
		if (!colors || colors.length === 0) {
			throw new Error('Кольори не знайдені для цього магазину')
		}
		return colors
	}
	async getColorById(id: string) {
		const color = await this.prisma.color.findUnique({
			where: {
				id
			}
		})
		if (!color) {
			throw new Error('Колір не знайдений')
		}
		return color
	}
	async createColor(dto: ColorDto, storeId: string) {
		return this.prisma.color.create({
			data: {
				...dto,
				storeId
			}
		})
	}
	async updateColor(id: string, dto: ColorDto) {
		const color = await this.getColorById(id)
		if (!color) {
			throw new Error('Колір не знайдений')
		}
		return this.prisma.color.update({
			where: {
				id
			},
			data: {
				name: dto.name || color.name,
				value: dto.value || color.value
			}
		})
	}
	async deleteColor(id: string) {
		const color = await this.getColorById(id)
		if (!color) {
			throw new Error('Колір не знайдений')
		}
		return this.prisma.color.delete({
			where: {
				id
			}
		})
	}
}
