import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { IProduct } from '../shared/types/product.interface'

class ProductService {
	async getAll(searchTerm?: string | null) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(),
			method: 'GET',
			params: searchTerm
				? {
						searchTerm
					}
				: {}
		})
		return data || []
	}

	async getById(id: string) {
		const { data } = await axiosClassic<IProduct>({
			url: API_URL.products(id),
			method: 'GET'
		})
		return data
	}
	async getByStoreId(storeId: string) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(`store/${storeId}`),
			method: 'GET'
		})
		return data || []
	}
	async getByCategoryId(categoryId: string) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(`category/${categoryId}`),
			method: 'GET'
		})
		return data || []
	}

	async getMostPopular(categoryId: string) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(`category/${categoryId}/popular`),
			method: 'GET'
		})
		return data || []
	}
	async getSimilarProducts(productId: string) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(productId),
			method: 'GET'
		})
		return data || []
	}

	async getByColorId(colorId: string) {
		const { data } = await axiosClassic<IProduct[]>({
			url: API_URL.products(`color/${colorId}`),
			method: 'GET'
		})
		return data || []
	}

	async create(storeId: string, data: Omit<IProduct, '_id'>) {
		const { data: createdData } = await axiosClassic<IProduct>({
			url: API_URL.products(`${storeId}/create`),
			method: 'POST',
			data
		})
		return createdData
	}

	async update(productId: string, data: Omit<IProduct, '_id'>) {
		const { data: updatedData } = await axiosClassic<IProduct>({
			url: API_URL.products(`${productId}/update`),
			method: 'PUT',
			data
		})
		return updatedData
	}
	async delete(productId: string) {
		await axiosClassic({
			url: API_URL.products(`${productId}/delete`),
			method: 'DELETE'
		})
	}
}
export default new ProductService()
