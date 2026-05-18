import {
	Controller,
	Get,
	HttpCode,
	Param,
	Put,
	Post,
	Body,
	Delete,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ReviewDto } from './dto/review.dto'
import { CurrentUser } from 'src/user/decorators/user.decorator'

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@HttpCode(200)
	@Auth()
	@Get('/product/:productId')
	async getReviewsByProductId(@Param('productId') productId: string) {
		return this.reviewService.getReviewsByProductId(productId)
	}

	@HttpCode(200)
	@Auth()
	@Get('/:reviewId')
	async getReviewById(@Param('reviewId') reviewId: string) {
		return this.reviewService.getReviewById(reviewId)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@Post('/product/:productId/create')
	async createReview(
		@Param('productId') productId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.createReview(userId, productId, dto)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(ValidationPipe)
	@Put('/:reviewId/update')
	async updateReview(
		@Param('reviewId') reviewId: string,
		@CurrentUser('id') userId: string,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.updateReview(reviewId, userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete('/:reviewId/delete')
	async deleteReview(
		@Param('reviewId') reviewId: string,
		@CurrentUser('id') userId: string
	) {
		return this.reviewService.deleteReview(reviewId, userId)
	}
}
