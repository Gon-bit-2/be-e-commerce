// src/routes/discount/index.ts

'use strict'
import express from 'express'
import cartController from '~/controller/cart.controller'

import { authenticationV2 } from '~/utils/auth'

const router = express.Router()

// Lấy số tiền được giảm giá

router.post('/', cartController.addToCart)
router.post('/update', cartController.updateCart)
router.delete('/', cartController.deleteCart)
router.get('/', cartController.listToCart)

// Các route này yêu cầu người dùng phải đăng nhập để lấy thông tin cá nhân (userId)
// và xác thực quyền
router.use(authenticationV2)

export default router
