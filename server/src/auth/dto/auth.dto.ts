import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsString({
		message: 'Введіть коректну електронну адресу'
	})
	@IsEmail()
	email!: string

	@MinLength(6, { message: 'Пароль повинен містити щонайменше 6 символів' })
	@IsString()
	password!: string
}
