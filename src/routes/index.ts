'use strict'
import express from 'express'
import accessRouter from './access'
import { apiKey, permission } from '~/utils/checkAuth'

const router = express.Router()
//check apikey
// router.use(apiKey)
//check permission
// router.use(permission('0000'))

router.use('/v1/api', accessRouter)
export default router
