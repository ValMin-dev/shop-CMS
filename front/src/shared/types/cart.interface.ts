import { IProduct } from './product.interface'

export interface ICartItem {
	id: string
	productId: IProduct
	quantity: number
	totalPrice: number
}
