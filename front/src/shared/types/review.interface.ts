import { IUser } from './user.interface'

export interface IReview {
	id: string
	createdAt: string
	rating: number
	comment: string
	userId: IUser
}

export interface IReviewInput extends Pick<IReview, 'rating' | 'comment'> {}
