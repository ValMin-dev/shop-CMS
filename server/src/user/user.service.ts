import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany()
	}
	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			include: {
				stores: true,
				orders: true,
				favoriteProducts: true
			}
		})
	}
	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: {
				stores: true,
				orders: true,
				favoriteProducts: true
			}
		})
	}
	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				name: dto.name,
				email: dto.email,
				password: await hash(dto.password)
			}
		})
	}
}
