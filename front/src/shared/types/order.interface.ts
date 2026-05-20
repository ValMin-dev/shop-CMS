import { ICartItem } from './cart.interface'
import { IUser } from './user.interface'

interface IAmount {
	value: number
	currency: string
}
interface IRecipient {
	account_id: string
	gateway_id: string
}

interface IPaymentMethod {
	type: string
	id: string
	saved: boolean
}

interface IConfirmation {
	type: string
	return_url: string
	confirmation_url: string
}
interface IPaymentResponse {
	id: string
	status: string
	amount: IAmount
	created_at: Date
	recipient: IRecipient
	payment_method: IPaymentMethod
	confirmation: IConfirmation
}

export enum EnumOrderStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELED = 'CANCELED'
}

export interface IOrder {
	id: string
	createdAt: string
	items: ICartItem[]
	status: EnumOrderStatus
	totalAmount: IAmount
	user: IUser
}
