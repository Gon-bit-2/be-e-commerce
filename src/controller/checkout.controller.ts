'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import { BadRequestError } from '~/middleware/error.middleware'
import { SuccessResponse } from '~/middleware/success.response'
import checkoutService from '~/services/checkout.service'

class CheckoutController {
  checkoutPre = async (req: Request, res: Response) => {
    const handleCheckout = await checkoutService.checkoutPreview(req.body)
    new SuccessResponse({
      message: 'Checkout Cart success',
      metadata: handleCheckout
    }).send(res)
  }
}

const checkoutController = new CheckoutController()
export default checkoutController
