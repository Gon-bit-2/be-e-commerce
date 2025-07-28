'use strict'
import express from 'express'
import productController from '~/controller/product.controller'

import { authentication } from '~/utils/auth'
const router = express.Router()

//authentication
router.use(authentication)
//
router.post('', productController.createProduct)
export default router
