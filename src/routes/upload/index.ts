'use strict'

import express from 'express'
import uploadController from '~/controller/upload.controller'

const router = express.Router()

router.post('/product', uploadController.uploadFile)
export default router
