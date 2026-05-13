import { IsString } from 'class-validator'

export class ColorDto {
	@IsString({
		message: 'Введіть назву кольору'
	})
	name!: string

	@IsString({
		message: 'Введіть коректний код кольору'
	})
	value!: string
}
