import { Request, Response } from 'express'
import { Types } from 'mongoose'
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

  async publishedProductByShop(req: Request, res: Response) {
    const { id } = req.params
    const publishedProduct = await productFactory.publishProductByShop({
      product_shop: req.user.userId,
      product_id: id
    })
    new SuccessResponse({
      message: 'Published Product success',
      metadata: publishedProduct
    }).send(res)
  }
  async unPublishedProductByShop(req: Request, res: Response) {
    const { id } = req.params
    const unPublishProduct = await productFactory.publishProductByShop({
      product_shop: req.user.userId,
      product_id: id
    })
    new SuccessResponse({
      message: 'Un Published Product success',
      metadata: unPublishProduct
    }).send(res)
  }
  async updateProduct(req: Request, res: Response) {
    const { id } = req.params
    const updateProduct = await productFactory.updateProduct(req.body.product_type, id, {
      ...req.body,
      product_shop: req.user.userId //đồng bộ Id
    })
    new SuccessResponse({
      message: 'update Product success',
      metadata: updateProduct
    }).send(res)
  }
  /**
   *
   * @description Get All Draft For Shop
   * @param product_shop: Types.ObjectId
   * @param limit : number
   * @param skip:number
   * @returns {JSON}
   */
  async getAllDraftForShop(req: Request, res: Response) {
    const AllDraft = await productFactory.findAllDraftForShop({
      product_shop: req.user.userId as Types.ObjectId
    })
    new SuccessResponse({
      message: 'Find Draft Success',
      metadata: AllDraft
    }).send(res)
  }
  async getAllPublishForShop(req: Request, res: Response) {
    const AllPublished = await productFactory.findAllPublishForShop({
      product_shop: req.user.userId as Types.ObjectId
    })
    new SuccessResponse({
      message: 'Find Draft Success',
      metadata: AllPublished
    }).send(res)
  }
  async getListSearchProduct(req: Request, res: Response) {
    const { keySearch } = req.params
    const resultsSearchProduct = await productFactory.searchProducts(keySearch)
    new SuccessResponse({
      message: 'Search Product Success',
      metadata: resultsSearchProduct
    }).send(res)
  }
  /**
   *
   * @param req.query chứa các thông tin ví dụ: ?limit=10&page=1
   */
  async getListAllProduct(req: Request, res: Response) {
    const allProduct = await productFactory.findAllProducts({
      limit: Number(req.query.limit), // Chuyển đổi sang Number, nếu không có sẽ là NaN
      sort: req.query.sort as string,
      page: Number(req.query.page),
      filter: req.query.filter as Record<string, any>
    })
    new SuccessResponse({
      message: 'Get All Product Success',
      metadata: allProduct
    }).send(res)
  }
  async findProduct(req: Request, res: Response) {
    const { id } = req.params
    const product = await productFactory.findProduct(id)
    new SuccessResponse({
      message: 'Get  Product Success',
      metadata: product
    }).send(res)
  }
}

const productController = new ProductController()
export default productController
