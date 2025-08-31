'use strict'

import express from 'express'
import { uploadDisk, uploadMemory } from '~/config/multer.config'
import uploadController from '~/controller/upload.controller'

const router = express.Router()

router.post('/product', uploadController.uploadFile)
router.post('/product/thumb', uploadDisk.single('file'), uploadController.uploadFileThumb)
router.post('/product/multiple', uploadDisk.array('files', 3), uploadController.uploadLocalFiles)
//aws s3
router.post('/product/bucket', uploadMemory.single('file'), uploadController.uploadImageFromLocalS3)

export default router
