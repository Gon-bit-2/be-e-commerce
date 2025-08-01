'use strict'
import express from 'express'
import checkoutController from '~/controller/checkout.controller'

import { authenticationV2 } from '~/utils/auth'
const router = express.Router()
router.post('/preview', checkoutController.checkoutPre)
//authentication
router.use(authenticationV2)

export default router
