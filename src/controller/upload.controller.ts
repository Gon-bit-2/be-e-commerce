'use strict'

import { Request, Response } from 'express'
import { BadRequestError } from '~/middleware/error.middleware'
import { SuccessResponse } from '~/middleware/success.response'
import uploadService from '~/services/upload.service'

class UploadController {
  async uploadFile(req: Request, res: Response) {
    const upload = await uploadService.uploadImageFromUrl()
    new SuccessResponse({
      message: `Upload file successfully`,
      metadata: upload
    }).send(res)
  }
  async uploadFileThumb(req: Request, res: Response) {
    const { file } = req
    if (!file) {
      throw new BadRequestError()
    }
    const upload = await uploadService.uploadImageFromLocal({ path: file.path })
    new SuccessResponse({
      message: `Upload file successfully`,
      metadata: upload
    }).send(res)
  }
  async uploadLocalFiles(req: Request, res: Response) {
    const { files } = req
    if (!files) {
      throw new BadRequestError()
    }
    const upload = await uploadService.uploadImageFromLocalFiles({ files })
    new SuccessResponse({
      message: `Upload files successfully`,
      metadata: upload
    }).send(res)
  }
  async uploadImageFromLocalS3(req: Request, res: Response) {
    console.log('Controller received request')
    console.log('Files:', req.files)
    console.log('File:', req.file)
    const { file } = req
    if (!file) {
      throw new BadRequestError()
    }
    const upload = await uploadService.uploadImageFromLocalS3AWS({ file })
    new SuccessResponse({
      message: `Upload file S3AWS successfully`,
      metadata: upload
    }).send(res)
  }
}
const uploadController = new UploadController()
export default uploadController
