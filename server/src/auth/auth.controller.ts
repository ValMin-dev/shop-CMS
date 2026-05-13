import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import type { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { user, ...tokens } = await this.authService.login(dto)
		this.authService.addRefreshTokenToResponse(res as any, tokens.refreshToken)
		return { user, accessToken: tokens.accessToken }
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { user, ...tokens } = await this.authService.register(dto)
		this.authService.addRefreshTokenToResponse(res as any, tokens.refreshToken)
		return { user, accessToken: tokens.accessToken }
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('logout')
	async logout(
		@Body('userId') userId: string,
		@Res({ passthrough: true }) res: Response
	) {
		await this.authService.logout(userId)
		this.authService.removeRefreshTokenToResponse(res as any)
		return { message: 'Ви успішно вийшли з системи' }
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req: Request) {
		return this.authService.validateOAuthLogin(req)
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthCallBack(
		@Req() req: any,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } =
			await this.authService.validateOAuthLogin(req)
		this.authService.addRefreshTokenToResponse(res as any, refreshToken)

		return res.redirect(
			`${process.env.CLIENT_URL}/dashboard?accessToken=${response.accessToken}`
		)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookie =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]
		if (!refreshTokenFromCookie) {
			this.authService.removeRefreshTokenToResponse(res as any)
			throw new Error('Відсутній refresh token')
		}
		const { refreshToken, ...response } = await this.authService.refresh(
			refreshTokenFromCookie
		)
		this.authService.addRefreshTokenToResponse(res as any, refreshToken)
		return response
	}
}
