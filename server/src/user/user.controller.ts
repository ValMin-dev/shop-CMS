import { Controller, Get, Param, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') userId: string) {
		return this.userService.getById(userId)
	}

	@Auth()
	@Get('favorites')
	async getFavoriteProducts(@CurrentUser('id') userId: string) {
		const user = await this.userService.getById(userId)
		if (!user) {
			throw new Error('Користувач не знайдений')
		}
		return user.favoriteProducts
	}

	@Auth()
	@Patch('profile/favorites/:productId')
	async toggleFavoriteProducts(
		@CurrentUser('id') userId: string,
		@Param('productId') productId: string
	) {
		return this.userService.toggleFavoriteProducts(userId, productId)
	}
}
