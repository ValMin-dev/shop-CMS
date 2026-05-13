import { Injectable } from '@nestjs/common'
import { FileResponse, UploadedFile } from './file.interface'
import { ensureDir, writeFile } from 'fs-extra'
import { path } from 'app-root-path'

@Injectable()
export class FileService {
	async saveFiles(
		files: UploadedFile[],
		folder: string = 'products'
	): Promise<FileResponse[]> {
		const uploadPath = `${path}/uploads/${folder}`
		await ensureDir(uploadPath)
		const fileResponses: FileResponse[] = await Promise.all(
			files.map(async file => {
				const originalName = `${Date.now()}-${file.originalname}`
				const filePath = `${uploadPath}/${originalName}`

				await writeFile(filePath, file.buffer)

				return {
					url: `/uploads/${folder}/${originalName}`,
					name: originalName
				}
			})
		)

		return fileResponses
	}
}
