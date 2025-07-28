'use strict'
import { Types } from 'mongoose'
import database from '~/db/database'
import { BadRequestError } from '~/middleware/error.middleware'
import { IProduct, ProductType } from '~/model/products.model'
class ProductFactory {
  async createProduct(type: ProductType, payload: IProduct) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`)
    }
  }
}
//define base product class
class Product {
  product_name: string
  product_thumb: string
  product_description?: string
  product_price: number
  product_quantity: number
  product_type: ProductType
  product_shop: Types.ObjectId
  product_attributes: any
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity
  }: IProduct) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }
  async createProduct() {
    return await database.product.create(this)
  }
}
//define sub class for different products types clothing
class Clothing extends Product {
  async createProduct(): Promise<any> {
    const newClothing = await database.clothing.create(this.product_attributes)
    if (!newClothing) throw new BadRequestError('Create new Clothing Error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new Product Error')
    return newProduct
  }
}
//define sub class for different products types Electronic
class Electronic extends Product {
  async createProduct(): Promise<any> {
    const newElectronic = await database.electronic.create(this.product_attributes)
    if (!newElectronic) throw new BadRequestError('Create new Electronic Error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new Product Error')
    return newProduct
  }
}

const productFactory = new ProductFactory()
export { productFactory }
