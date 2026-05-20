import { axiosClassic } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'

interface IFile {
	url: string
	name: string
}

class FileService {
	async upload(file: FormData, folder?: string) {
		const { data } = await axiosClassic<IFile[]>({
			url: API_URL.files(),
			method: 'POST',
			params: { folder },
			data: file,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return data
	}
}

export default new FileService()
