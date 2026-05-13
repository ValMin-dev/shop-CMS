import { IsOptional, IsString } from 'class-validator'

export class CategoryDto {
	@IsString({
		message: 'Введіть назву категорії'
	})
	name!: string

	@IsOptional()
	@IsString({
		message: 'Введіть коректний опис категорії'
	})
	description?: string
}
