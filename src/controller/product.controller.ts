import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import { productFactory } from '~/services/product.service'

class ProductController {
  async createProduct(req: Request, res: Response) {
    const newProduct = await productFactory.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId
    })
    new SuccessResponse({
      message: 'Create Product success',
      metadata: newProduct
    }).send(res)
  }
}

const productController = new ProductController()
export default productController
