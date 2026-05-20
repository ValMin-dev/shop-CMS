import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import {
	IStore,
	IStoreCreate,
	IStoreEdit
} from '../shared/types/store.interface'

class StoreService {
	async getAll() {
		const { data } = await axiosClassic({
			url: API_URL.stores(),
			method: 'GET'
		})
		return data
	}

	async getById(storeId: string) {
		const { data } = await axiosClassic<IStore>({
			url: API_URL.stores(storeId),
			method: 'GET'
		})
		return data
	}
	async getMyStore() {
		const { data } = await axiosClassic<IStore>({
			url: API_URL.stores('my'),
			method: 'GET'
		})
		return data
	}

	async create(storeId: string, data: IStoreCreate) {
		const { data: createdData } = await axiosClassic<IStore>({
			url: API_URL.stores(`${storeId}/create`),
			method: 'POST',
			data
		})
		return createdData
	}

	async update(storeId: string, data: IStoreEdit) {
		const { data: updatedData } = await axiosClassic<IStore>({
			url: API_URL.stores(`${storeId}/update`),
			method: 'PUT',
			data
		})
		return updatedData
	}
	async delete(storeId: string) {
		await axiosClassic({
			url: API_URL.stores(`${storeId}/delete`),
			method: 'DELETE'
		})
	}
}

export default new StoreService()
