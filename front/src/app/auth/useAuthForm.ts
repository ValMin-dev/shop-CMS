'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PUBLIC_URL } from '@/config/url.config'
import { IAuthForm } from '@/shared/types/auth.interface'
import authService from '@/services/auth/auth.service'
export function useAuthForm(isReg: boolean) {
	const router = useRouter()
	const form = useForm({ mode: 'onChange' })
	const { mutate, isPending } = useMutation({
		mutationKey: ['auth user'],
		mutationFn: async (data: IAuthForm) => {
			return authService.main(isReg ? 'register' : 'login', data)
		},
		onSuccess() {
			form.reset()
			toast.success(isReg ? 'Реєстрація успішна' : 'Авторизація успішна!')
			router.replace(PUBLIC_URL.home())
		},
		onError(error: any) {
			const message = error?.response?.data?.message || 'Сталася помилка'
			toast.error(message)
		}
	})
	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}
	return {
		form,
		onSubmit,
		isPending
	}
}
