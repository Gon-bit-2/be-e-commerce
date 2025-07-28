'use strict'
import express from 'express'
import accessRouter from './access'
import productRouter from './product'
import { apiKey, permission } from '~/utils/checkAuth'

const router = express.Router()
router.use('/v1/api', accessRouter)

router.use('/v1/api/product/', productRouter)
//check apikey
router.use(apiKey)
//check permission
router.use(permission('0000'))

export default router
