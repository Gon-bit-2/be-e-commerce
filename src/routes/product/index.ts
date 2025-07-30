'use strict'
import express from 'express'
import productController from '~/controller/product.controller'

import { authenticationV2 } from '~/utils/auth'
const router = express.Router()

router.get('/search/:keySearch', productController.getListSearchProduct)
router.get('', productController.getListAllProduct)
router.get('/:id', productController.findProduct)

//authentication
router.use(authenticationV2)
//CRUD
router.post('', productController.createProduct)
router.post('/publish/:id', productController.publishedProductByShop)
router.post('/unpublish/:id', productController.unPublishedProductByShop)
router.patch('/:id', productController.updateProduct)
//Query
router.get('/drafts/all', productController.getAllDraftForShop)
router.get('/published/all', productController.getAllPublishForShop)
export default router
