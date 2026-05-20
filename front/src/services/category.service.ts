import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { ICategory, ICategoryInput } from '../shared/types/category.interface'

class CategoryService {
	async getAll() {
		const { data } = await axiosClassic<ICategory[]>({
			url: API_URL.categories(),
			method: 'GET'
		})
		return data
	}

	async getById(id: string) {
		const { data } = await axiosClassic<ICategory>({
			url: API_URL.categories(id),
			method: 'GET'
		})
		return data
	}

	async getByStoreId(storeId: string) {
		const { data } = await axiosClassic<ICategory[]>({
			url: API_URL.categories(`store/${storeId}`),
			method: 'GET'
		})
		return data
	}
	async create(storeId: string, data: ICategoryInput) {
		const { data: createdData } = await axiosClassic<ICategory>({
			url: API_URL.categories(`${storeId}/create`),
			method: 'POST',
			data
		})
		return createdData
	}

	async update(categoryId: string, data: ICategoryInput) {
		const { data: updatedData } = await axiosClassic<ICategory>({
			url: API_URL.categories(`${categoryId}/update`),
			method: 'PUT',
			data
		})
		return updatedData
	}
	async delete(categoryId: string) {
		await axiosClassic({
			url: API_URL.categories(`${categoryId}/delete`),
			method: 'DELETE'
		})
	}
}

export default new CategoryService()
