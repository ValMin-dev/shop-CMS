import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { FileService } from './file.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UploadedFile } from './file.interface'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@HttpCode(200)
	@Auth()
	@Post()
	@UseInterceptors(FilesInterceptor('files'))
	async uploadFiles(
		@UploadedFiles() files: UploadedFile[],
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFiles(files, folder)
	}
}
