import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist/jwt.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwt: JwtService,
		private prisma: PrismaService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueToken(user.id)

		return { user, ...tokens }
	}

	async register(dto: AuthDto) {
		const existingUser = await this.userService.getByEmail(dto.email)
		if (existingUser) {
			console.log(existingUser)
			throw new Error('Користувач з такою електронною адресою вже існує')
		}
		const user = await this.userService.create(dto)
		const tokens = await this.issueToken(user.id)

		return { user, ...tokens }
	}

	async issueToken(userId: string) {
		const payload = { sub: userId }
		const accessToken = this.jwt.sign(payload, {
			expiresIn: '7d'
		})
		const refreshToken = this.jwt.sign(payload, {
			expiresIn: '30d'
		})
		return {
			accessToken,
			refreshToken
		}
	}

	async logout(userId: string) {}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		if (user.password !== dto.password) {
			throw new Error('Невірний пошта або пароль')
		}

		return user
	}

	async refresh(refreshToken: string) {
		try {
			const payload = this.jwt.verify(refreshToken)
			const user = await this.userService.getById(payload.sub)
			if (!user) {
				throw new Error('Користувач не знайдений')
			}
			return this.issueToken(user.id)
		} catch (e) {
			throw new Error('Невірний або прострочений токен')
		}
	}
}
