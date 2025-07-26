'use strict'
import express from 'express'
import accessController from '~/controller/access.controller'
const router = express.Router()

router.post('/shop/signup', accessController.signup)
export default router
