'use strict'
import express from 'express'
import productController from '~/controller/product.controller'

import { authenticationV2 } from '~/utils/auth'
const router = express.Router()

//authentication
router.use(authenticationV2)
//
router.post('', productController.createProduct)
export default router
