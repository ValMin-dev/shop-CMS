import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt/dist/jwt.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { verify, hash } from 'argon2'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 30
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private userService: UserService,
		private jwt: JwtService,
		private prisma: PrismaService,
		private configService: ConfigService
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

	async logout(userId: string) {
		const user = await this.userService.getById(userId)
		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		this.removeRefreshTokenToResponse(userId as any)
		return { message: 'Ви успішно вийшли з системи' }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		if (!user.password || !(await verify(user.password, dto.password))) {
			throw new Error('Невірний пошта або пароль')
		}

		return user
	}

	async validateOAuthLogin(req: any) {
		let user = await this.userService.getByEmail(req.user.email)
		if (!user) {
			user = await this.prisma.user.create({
				data: {
					email: req.user.email,
					name: req.user.firstName + ' ' + req.user.lastName,
					password: await hash(req.user.id + process.env.JWT_SECRET)
				},
				include: {
					stores: true,
					orders: true,
					favoriteProducts: true
				}
			})
		}
		const tokens = await this.issueToken(user.id)
		return { user, ...tokens }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) {
			throw new Error('Невірний або прострочений токен')
		}
		const user = await this.userService.getById(result.sub)
		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		return this.issueToken(user.id)
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

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			domain: this.configService.get<string>('SERVER_DOMAIN'),
			maxAge: this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000,
			expires: expiresIn,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})
		return { refreshToken }
	}

	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			domain: this.configService.get<string>('SERVER_DOMAIN'),
			expires: new Date(0),
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})
	}
}
