import { axiosAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { EnumOrderStatus } from '../shared/types/order.interface'

type TypeData = {
	status?: EnumOrderStatus
	items: {
		productId: string
		quantity: number
		storeId: string
		price: number
	}[]
}

class OrderService {
	async create(data: TypeData) {
		return axiosAuth({
			url: API_URL.orders('create'),
			method: 'POST',
			data
		})
	}
	async getAll() {
		const { data } = await axiosAuth({
			url: API_URL.orders('all'),
			method: 'GET'
		})
		return data
	}
}

export default new OrderService()
