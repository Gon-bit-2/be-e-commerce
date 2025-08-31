'use strict'

import cloudinary from '~/config/cloudinary.config'
import { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '~/config/s3.config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ServerErrorResponse } from '~/middleware/error.middleware'
import crypto from 'crypto'
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
  async uploadImageFromLocal({ path, folderName = 'product/0710' }: { path: string; folderName?: string }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: 'thumb',
        folder: folderName
      })
      return {
        image_url: result.secure_url,
        shopId: '0710',
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg'
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerErrorResponse()
      }
    }
  }
  async uploadImageFromLocalFiles({ files, folderName = 'product/0710' }: { files: any; folderName?: string }) {
    try {
      if (files.length) return
      const uploadUrls: any[] = []
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: folderName
        })
        uploadUrls.push({
          image_url: result.secure_url,
          shopId: '0710',
          thumb_url: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            format: 'jpg'
          })
        })
      }

      return uploadUrls
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerErrorResponse()
      }
    }
  }
  /////////start upload aws///////
  async uploadImageFromLocalS3AWS({ file }: { file: any }) {
    try {
      if (!file) {
        throw new Error('No file provided')
      }

      // Validate required environment variables
      if (!process.env.AWS_BUCKET_NAME) {
        throw new Error('AWS_BUCKET_NAME environment variable is not set')
      }
      const randomImageName = () => crypto.randomBytes(16).toString('hex')
      const imageName = randomImageName()
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype || 'image/jpeg'
      })
      const result = await s3.send(command)

      const singedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName
      })
      const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 }) // url image upload
      return url
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerErrorResponse()
      }
    }
  }
}
const uploadService = new UploadService()
export default uploadService
