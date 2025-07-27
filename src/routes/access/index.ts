'use strict'
import express from 'express'
import accessController from '~/controller/access.controller'
import { authentication } from '~/utils/auth'
const router = express.Router()

router.post('/shop/signup', accessController.signup)
router.post('/shop/login', accessController.login)

//authentication
router.use(authentication)
//
router.post('/shop/logout', accessController.logout)

export default router
