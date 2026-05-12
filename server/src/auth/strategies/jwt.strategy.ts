import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET'),
			ignoreExpiration: true
		})
	}
	async validate(payload: { sub: string; email: string }) {
		const user = await this.userService.getById(payload.sub)
		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		return user
	}
}
