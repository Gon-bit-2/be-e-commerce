'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import { BadRequestError } from '~/middleware/error.middleware'
import { SuccessResponse } from '~/middleware/success.response'
import cartService from '~/services/cart.service'

class CartController {
  addToCart = async (req: Request, res: Response) => {
    const handleAddToCart = await cartService.addToCart(req.body)
    new SuccessResponse({
      message: 'Create new success',
      metadata: handleAddToCart
    }).send(res)
  }
  //update + -
  updateCart = async (req: Request, res: Response) => {
    const handleUpdateCart = await cartService.updateToCart(req.body)
    new SuccessResponse({
      message: 'Update Cart success',

      metadata: handleUpdateCart
    }).send(res)
  }
  //
  deleteCart = async (req: Request, res: Response) => {
    const handleDeleteCart = await cartService.deleteUserCart(req.body)
    new SuccessResponse({
      message: 'Delete Cart success',
      metadata: handleDeleteCart
    }).send(res)
  }
  //
  listToCart = async (req: Request, res: Response) => {
    const { userId } = req.query
    if (!userId || typeof userId !== 'string') {
      // Nếu không hợp lệ, ném ra lỗi
      throw new BadRequestError('User ID is required')
    }
    const handleDeleteCart = await cartService.getListUserCart(userId)
    new SuccessResponse({
      message: 'Get List Cart success',
      metadata: handleDeleteCart
    }).send(res)
  }
}

const cartController = new CartController()
export default cartController
