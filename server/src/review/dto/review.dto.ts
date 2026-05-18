import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ReviewDto {
	@IsString({ message: 'Текст відгуку повинен быть строкой' })
	comment!: string

	@IsNumber({}, { message: 'Рейтинг відгуку повинен быть числом' })
	rating!: number

	@IsString({ message: 'Ідентифікатор продукту повинен быть строкой' })
	productId!: string

	@IsOptional()
	@IsString({ message: 'Ідентифікатор магазину повинен быть строкой' })
	storeId!: string
}
