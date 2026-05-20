export interface IMainStatistics {
	id: string
	name: string
	value: number
}
export interface ILastUsers {
	id: string
	name: string
	email: string
	picture: string
	total: number
}

export interface IMonthlyStatistics {
	date: string
	value: number
}

export interface IMiddleStatistics {
	monthlyRevenue: IMonthlyStatistics[]
	monthlyOrders: IMonthlyStatistics[]
	lastUsers: ILastUsers[]
}
