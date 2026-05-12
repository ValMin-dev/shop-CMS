import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import 'dotenv/config'

import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		exposedHeaders: ['Set-Cookie']
	})
	await app.listen(process.env.PORT ?? 5000)
}
bootstrap()
