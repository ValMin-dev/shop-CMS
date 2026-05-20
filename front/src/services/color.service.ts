import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { IColor, IColorInput } from '../shared/types/color.interface'

class ColorService {
	async getAll() {
		const { data } = await axiosClassic<IColor[]>({
			url: API_URL.colors(),
			method: 'GET'
		})
		return data
	}

	async getById(id: string) {
		const { data } = await axiosClassic<IColor>({
			url: API_URL.colors(id),
			method: 'GET'
		})
		return data
	}

	async getByStoreId(storeId: string) {
		const { data } = await axiosClassic<IColor[]>({
			url: API_URL.colors(`store/${storeId}`),
			method: 'GET'
		})
		return data
	}
	async create(storeId: string, data: IColorInput) {
		const { data: createdData } = await axiosClassic<IColor>({
			url: API_URL.colors(`${storeId}/create`),
			method: 'POST',
			data
		})
		return createdData
	}

	async update(id: string, data: IColorInput) {
		const { data: updatedData } = await axiosClassic<IColor>({
			url: API_URL.colors(`${id}/update`),
			method: 'PUT',
			data
		})
		return updatedData
	}
	async delete(id: string) {
		await axiosClassic({
			url: API_URL.colors(`${id}/delete`),
			method: 'DELETE'
		})
	}
}

export default new ColorService()
