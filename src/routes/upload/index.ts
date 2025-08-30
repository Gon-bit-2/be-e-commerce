'use strict'

import express from 'express'
import uploadDisk from '~/config/multer.config'
import uploadController from '~/controller/upload.controller'

const router = express.Router()

router.post('/product', uploadController.uploadFile)
router.post('/product/thumb', uploadDisk.single('file'), uploadController.uploadFileThumb)

export default router
