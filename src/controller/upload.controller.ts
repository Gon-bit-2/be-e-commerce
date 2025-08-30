'use strict'

import { Request, Response } from 'express'
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
}
const uploadController = new UploadController()
export default uploadController
