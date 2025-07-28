'use strict'
import express from 'express'
import accessController from '~/controller/access.controller'
import { authenticationV2 } from '~/utils/auth'
const router = express.Router()

router.post('/shop/signup', accessController.signup)
router.post('/shop/login', accessController.login)

//authentication
router.use(authenticationV2)
//
router.post('/shop/logout', accessController.logout)
router.post('/shop/handlerRefreshToken', accessController.handlerRefreshToken)
export default router
