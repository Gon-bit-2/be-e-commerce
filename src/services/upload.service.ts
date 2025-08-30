'use strict'

import cloudinary from '~/config/cloudinary.config'
import { ServerErrorResponse } from '~/middleware/error.middleware'

class UploadService {
  async uploadImageFromUrl() {
    try {
      const urlImage = `https://th.bing.com/th/id/R.e52bd428d0e821fed4d58ab6988d44c8?rik=93pJt4Ys7Aw7bg&riu=http%3a%2f%2flofrev.net%2fwp-content%2fphotos%2f2016%2f08%2frandom_logo_1.png&ehk=4Su0HMlE75LqSpA67oF3OzYp%2bdhGI8eAsSe%2bCC9Qy1E%3d&risl=&pid=ImgRaw&r=0`
      const folderName = `product/shopId`,
        newFileName = `testDemo`
      const result = await cloudinary.uploader.upload(urlImage, {
        folder: folderName
      })
      return result
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerErrorResponse()
      }
    }
  }
}
const uploadService = new UploadService()
export default uploadService
