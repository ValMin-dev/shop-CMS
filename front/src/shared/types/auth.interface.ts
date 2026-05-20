import { IUser } from './user.interface'

export interface IAuthForm {
	email: string
	name: string
	password: string
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
}
