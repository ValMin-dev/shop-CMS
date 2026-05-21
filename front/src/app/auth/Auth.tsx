'use client'

import { useState } from 'react'
import { useAuthForm } from './useAuthForm'
import { Button } from '@/components/ui/button'

export function Auth() {
	const [isReg, setIsReg] = useState(false)
	const { form, onSubmit, isPending } = useAuthForm(isReg)
	return (
		<div className='container flex flex-col items-center justify-center gap-4 py-8'>
			<h1 className='text-4xl font-bold'>Сторінка авторизації</h1>
			<p className='text-lg text-gray-600'>
				Тут користувачі можуть увійти або зареєструватися.
			</p>
			<Button className='cursor-pointer '>adawdawds</Button>
		</div>
	)
}
