import {
	ArrayMinSize,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'

export class ProductDto {
	@IsNotEmpty()
	@IsString({ message: 'Назва продукту повинна бути вказана' })
	name!: string

	@IsOptional()
	@IsString({ message: 'Опис продукту повинен бути вказаний' })
	description?: string

	@IsNumber({}, { message: 'Ціна продукту повинна бути числом' })
	price!: number

	@IsOptional()
	@ArrayMinSize(1, {
		message: 'Потрібно вказати хоча б одне зображення продукту'
	})
	@IsString({ message: 'Зображення продукту повинно бути рядком' })
	images?: string[]

	@IsString({ message: 'Колір продукту повинен бути вказаний' })
	colorId?: string

	@IsString({ message: 'Ідентифікатор категорії повинен бути вказаний' })
	categoryId!: string
}
