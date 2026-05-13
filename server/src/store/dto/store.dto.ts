import { IsOptional, IsString } from 'class-validator'

export class StoreDto {
	@IsString()
	name!: string

	@IsOptional()
	@IsString()
	description?: string
}
