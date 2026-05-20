import type { Metadata } from 'next'
import Home from './Home'
export const metadata: Metadata = {
	title: 'Головна',
	description: 'Головна сторінка сайту'
}

export default function Page() {
	return <Home />
}
