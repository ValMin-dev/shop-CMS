class AmountPayment {
	value!: number
	currency!: string
}
class PaymentMethod {
	id!: string
	type!: string
	saved!: boolean
	title!: string
	card!: object
}

class ObjectPayment {
	id!: string
	status!: string
	amount!: AmountPayment
	created_at!: string
	expires_at!: string
	description!: string
	payment_method!: PaymentMethod
}

export class PaymentStatusDto {
	event!:
		| 'payment.successed'
		| 'payment.waiting_for_capture'
		| 'payment.canceled'
		| 'payment.captured'
		| 'payment.refunded'
		| 'payment.failed'
	object!: ObjectPayment
	type!: string
}
