export interface FileResponse {
	url: string
	name: string
}

export type UploadedFile = {
	originalname: string
	buffer: Buffer
}
