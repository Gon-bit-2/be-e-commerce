'use strict'
import express from 'express'
import commentController from '~/controller/comment.controller'

import { authenticationV2 } from '~/utils/auth'
const router = express.Router()
//authentication
router.use(authenticationV2)
router.post('/', commentController.createComment)

export default router
