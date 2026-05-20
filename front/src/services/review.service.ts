import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { IReview } from '../shared/types/review.interface'

class ReviewService {
	async getAll() {
		const { data } = await axiosClassic({
			url: API_URL.reviews(),
			method: 'GET'
		})
		return data
	}

	async getById(id: string) {
		const { data } = await axiosClassic<IReview>({
			url: API_URL.reviews(id),
			method: 'GET'
		})
		return data
	}

	async getByStoreId(storeId: string) {
		const { data } = await axiosClassic<IReview[]>({
			url: API_URL.reviews(`store/${storeId}`),
			method: 'GET'
		})
		return data
	}
	async create(storeId: string, data: IReview) {
		const { data: createdData } = await axiosClassic<IReview>({
			url: API_URL.reviews(`store/${storeId}`),
			method: 'POST',
			data
		})
		return createdData
	}

	async update(id: string, data: IReview) {
		const { data: updatedData } = await axiosClassic<IReview>({
			url: API_URL.reviews(id),
			method: 'PUT',
			data
		})
		return updatedData
	}
	async delete(id: string) {
		await axiosClassic({
			url: API_URL.reviews(id),
			method: 'DELETE'
		})
	}
}

export default new ReviewService()
