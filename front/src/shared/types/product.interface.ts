import { ICategory } from './category.interface'
import { IColor } from './color.interface'
import { IReview } from './review.interface'
import { IStore } from './store.interface'

export interface IProduct {
	id: string
	name: string
	description: string
	price: number
	images: string[]
	category: ICategory
	reviews: IReview[]
	color: IColor
	store: IStore
}

export interface IProductInput extends Omit<
	IProduct,
	'id' | 'category' | 'reviews' | 'store' | 'color'
> {
	categoryId: string
	colorId: string
}
