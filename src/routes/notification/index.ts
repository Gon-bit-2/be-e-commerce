'use strict'
import express from 'express'
import notificationController from '~/controller/notification.controller'

import { authenticationV2 } from '~/utils/auth'
const router = express.Router()
//authentication
router.use(authenticationV2)
router.get('/', notificationController.getListNotiByUser)

export default router
