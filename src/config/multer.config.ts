'use strict'
import multer from 'multer'
const uploadMemory = multer({
  storage: multer.memoryStorage()
  // limits: { fileSize: 5 * 1024 * 1024 } // optional: 5MB limit
})
const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})
export { uploadDisk, uploadMemory }
