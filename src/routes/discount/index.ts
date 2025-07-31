// src/routes/discount/index.ts

'use strict'
import express from 'express'
import discountController from '~/controller/discount.controller'
import { authenticationV2 } from '~/utils/auth'

const router = express.Router()

// Lấy số tiền được giảm giá

router.post('/amount', discountController.getDiscountAmount)
// Các route này yêu cầu người dùng phải đăng nhập để lấy thông tin cá nhân (userId)
// và xác thực quyền
router.use(authenticationV2)
router.get('/list_product_code', discountController.getAllDiscountCodeProduct)

// Lấy danh sách mã giảm giá của shop
router.get('/', discountController.getAllDiscountCodeShop)

// Lấy các sản phẩm được áp dụng mã giảm giá
router.get('/', discountController.getAllDiscountCodeProduct)

// Tạo mã giảm giá (chỉ dành cho shop)
router.post('/', discountController.createDiscountCode)

// Xóa mã giảm giá (chỉ dành cho shop)
router.delete('/', discountController.deleteDiscountCode)

export default router
