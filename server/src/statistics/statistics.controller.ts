import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Auth()
	@HttpCode(200)
	@Get('/main/:storeId')
	async getMainStatistics(@Param('storeId') storeId: string) {
		return this.statisticsService.getMainStatistics(storeId)
	}

	@Auth()
	@HttpCode(200)
	@Get('/middle/:storeId')
	async getMiddleStatistics(@Param('storeId') storeId: string) {
		return this.statisticsService.getMiddleStatistics(storeId)
	}
}
