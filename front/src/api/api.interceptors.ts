import axios, { CreateAxiosDefaults } from 'axios'
import { errorCatch, getContentType } from './api.helper'
import { SERVER_URL } from '../config/api.config'
import AuthService from '../services/auth/auth.service'
import {
	getAccessToken,
	removeTokenStorage
} from '../services/auth/auth-token-service'
const options: CreateAxiosDefaults = {
	baseURL: SERVER_URL,
	withCredentials: true,
	headers: getContentType()
}

const axiosClassic = axios.create(options)
const axiosAuth = axios.create(options)

axiosAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	if (accessToken && config.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})
axiosAuth.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config
		if (
			error.response.status === 401 ||
			errorCatch(error) === 'jwt expired' ||
			errorCatch(error) === 'jwt must be provided'
		) {
			originalRequest._isRetry = true
			try {
				await AuthService.getNewTokens()
				return axiosAuth.request(originalRequest)
			} catch (err) {
				if (errorCatch(err) === 'jwt expired') removeTokenStorage()
			}
		}
	}
)

export { axiosClassic, axiosAuth }
