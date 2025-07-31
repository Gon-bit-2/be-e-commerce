'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import { Types } from 'mongoose'
import { SuccessResponse } from '~/middleware/success.response'
import discountService from '~/services/discount.service'
class DiscountController {
  async createDiscountCode(req: Request, res: Response) {
    const discountCode = await discountService.createDiscountCode({ ...req.body, discount_shopId: req.user.userId })
    new SuccessResponse({ message: 'Create Discount Code Success', metadata: discountCode }).send(res)
  }
  async getAllDiscountCodeShop(req: Request, res: Response) {
    const { limit, page } = req.query
    const allDiscountCode = await discountService.getAllDiscountCodeByShop({
      limit: Number(limit) || 50,
      page: Number(page) || 1,
      discount_shopId: req.user.userId
    })
    new SuccessResponse({ message: 'Get Discount Code Success', metadata: allDiscountCode }).send(res)
  }
  async getAllDiscountCodeProduct(req: Request, res: Response) {
    const { code, shopId, limit, page } = req.query
    const allDiscountCode = await discountService.getAllDiscountCodeWithProduct({
      discount_code: code as string,
      discount_shopId: shopId as unknown as Types.ObjectId,
      userId: req.user.userId,
      limit: Number(limit) || 50,
      page: Number(page) || 1
    })
    new SuccessResponse({ message: 'Get Discount Code Success', metadata: allDiscountCode }).send(res)
  }
  async getDiscountAmount(req: Request, res: Response) {
    const discountAmount = await discountService.getDiscountAmount({
      ...req.body
    })
    new SuccessResponse({ message: 'Get Discount Amount Success', metadata: discountAmount }).send(res)
  }
  async deleteDiscountCode(req: Request, res: Response) {
    const discountAmount = await discountService.deleteDiscountCode({
      ...req.body,
      discount_shopId: req.user.userId
    })
    new SuccessResponse({ message: 'Get Discount Amount Success', metadata: discountAmount }).send(res)
  }
}

const discountController = new DiscountController()
export default discountController
