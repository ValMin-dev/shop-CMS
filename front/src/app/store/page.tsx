import { Metadata } from 'next'
import { NO_INDEX_PAGE } from '@/src/constants/seo.constants'
import { Store } from './Store'

export const metadata: Metadata = {
	title: 'Керування сторінками',
	description: 'Сторінка для керування сторінками сайту',
	...NO_INDEX_PAGE
}

export default function StorePage() {
	return <Store />
}
