import type { Metadata } from 'next'
import { Auth } from './Auth'

export const metadata: Metadata = {
	title: 'Авторизація',
	description: 'Сторінка авторизації користувача'
}
export default function AuthPage() {
	return <Auth />
}
