export const APP_URL = process.env.APP_URL as string

export const PUBLIC_URL = {
	root: (url = '') => `${url ? url : ''}`,
	home: () => PUBLIC_URL.root('/'),
	auth: () => PUBLIC_URL.root('/auth'),
	explorer: (query = '') => PUBLIC_URL.root(`/explorer/${query}`),
	category: (id: string) => PUBLIC_URL.root(`/category/${id}`),
	product: (id: string) => PUBLIC_URL.root(`/product/${id}`)
}
export const DASHBOARD_URL = {
	root: (url = '') => `/dashboard${url ? url : ''}`,
	home: () => DASHBOARD_URL.root('/'),
	favorites: () => DASHBOARD_URL.root('/favorites')
}
export const STORE_URL = {
	root: (url = '') => `/store${url ? url : ''}`,
	home: (storeId = '') => STORE_URL.root(`/${storeId}`),

	products: (storeId = '') => STORE_URL.root(`/${storeId}/products`),
	productCreate: (storeId = '') =>
		STORE_URL.root(`/${storeId}/products/create`),
	productEdit: (storeId = '', productId = '') =>
		STORE_URL.root(`/${storeId}/products/${productId}/edit`),

	categories: (storeId = '') => STORE_URL.root(`/${storeId}/categories`),
	categoryCreate: (storeId = '') =>
		STORE_URL.root(`/${storeId}/categories/create`),
	categoryEdit: (storeId = '', categoryId = '') =>
		STORE_URL.root(`/${storeId}/categories/${categoryId}/edit`),

	colors: (storeId = '') => STORE_URL.root(`/${storeId}/colors`),
	colorCreate: (storeId = '') => STORE_URL.root(`/${storeId}/colors/create`),
	colorEdit: (storeId = '', colorId = '') =>
		STORE_URL.root(`/${storeId}/colors/${colorId}/edit`),

	reviews: (storeId = '') => STORE_URL.root(`/${storeId}/reviews`),

	settings: (storeId = '') => STORE_URL.root(`/${storeId}/settings`)
}
