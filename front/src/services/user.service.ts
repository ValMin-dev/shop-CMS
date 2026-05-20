import { IUser } from '../shared/types/user.interface'
import { axiosAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
class UserService {
	async getProfile() {
		const { data } = await axiosAuth<IUser | null>({
			url: API_URL.users('profile'),
			method: 'GET'
		})
		return data
	}
	async toggleFavorite(productId: string) {
		const { data } = await axiosAuth<IUser>({
			url: API_URL.users(`profile/favorites/${productId}`),
			method: 'POST'
		})
		return data
	}
}

export default new UserService()
