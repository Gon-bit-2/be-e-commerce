'use strict'
import { Types } from 'mongoose'
import database from '~/db/database'
import { BadRequestError, ConFlictRequestError } from '~/middleware/error.middleware'
import { IProduct, ProductType } from '~/model/products.model'
import { insertInventory } from '~/model/repositories/inventory.repo'
import {
  existingProduct,
  findAllDraftForShop,
  findAllProducts,
  findAllPublishForShop,
  findProduct,
  publishProductByShop,
  searchProductByUser,
  UnPublishProductByShop,
  updateProductById
} from '~/model/repositories/product.repo'
import { removeUndefinedObject, updateNestedObjectParser } from '~/utils'
class ProductFactory {
  async createProduct(type: ProductType, payload: IProduct) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      case 'Furniture':
        return new Furniture(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`)
    }
  }
  //PUT-POST//
  async publishProductByShop({ product_shop, product_id }: { product_shop: string; product_id: string }) {
    return await publishProductByShop({ product_shop, product_id })
  }
  async UnPublishProductByShop({ product_shop, product_id }: { product_shop: string; product_id: string }) {
    return await UnPublishProductByShop({ product_shop, product_id })
  }

  //END PUT//

  //PATCH//
  async updateProduct(type: ProductType, productId: string, payload: IProduct) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).updateProduct(productId)
      case 'Clothing':
        return new Clothing(payload).updateProduct(productId)
      case 'Furniture':
        return new Furniture(payload).updateProduct(productId)
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`)
    }
  }
  //END PATCH//

  //Query//

  async findAllDraftForShop({
    product_shop,
    limit = 50,
    skip = 0
  }: {
    product_shop: Types.ObjectId
    limit?: number
    skip?: number
  }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftForShop({ query, limit, skip })
  }
  async searchProducts(keySearch: string) {
    return await searchProductByUser(keySearch)
  }
  //End QUERY//
  async findAllPublishForShop({
    product_shop,
    limit = 50,
    skip = 0
  }: {
    product_shop: Types.ObjectId
    limit?: number
    skip?: number
  }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }
  async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true }
  }: {
    limit: number
    sort: string
    page: number
    filter: Record<string, any>
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }
  async findProduct(product_id: string) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }
  ////
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
  isDraft: boolean
  isPublished: boolean
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
    isDraft,
    isPublished
  }: IProduct) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
    this.isDraft = isDraft
    this.isPublished = isPublished
  }
  async createProduct(productId: Types.ObjectId) {
    const newProduct = await database.product.create({ ...this, _id: productId })
    if (newProduct) {
      //add stock vào Inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        productStock: newProduct.product_quantity
      })
    }
    return newProduct
  }
  async updateProduct(productId: string, bodyUpdate: any) {
    return await updateProductById({ productId, bodyUpdate, model: database.product })
  }
}
//define sub class for different products types clothing
class Clothing extends Product {
  async createProduct(): Promise<any> {
    const checkExits = await existingProduct({
      productName: this.product_name,
      productShop: this.product_shop
    })

    if (checkExits) {
      throw new ConFlictRequestError('Error: Product already exists!')
    }
    const newClothing = await database.clothing.create({ ...this.product_attributes, product_shop: this.product_shop })
    if (!newClothing) throw new BadRequestError('Create new Clothing Error')
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')
    return newProduct
  }
  async updateProduct(productId: string) {
    // console.log('Check this::::', this)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const bodyUpdate = removeUndefinedObject(this)
    // console.log('sau khi check null or undefined::', bodyUpdate)

    if (bodyUpdate.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(bodyUpdate.product_attributes),
        model: database.clothing
      })
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(bodyUpdate))
    return updateProduct
  }
}
//define sub class for different products types Electronic
class Electronic extends Product {
  async createProduct(): Promise<any> {
    const checkExits = await existingProduct({
      productName: this.product_name,
      productShop: this.product_shop
    })

    if (checkExits) {
      throw new ConFlictRequestError('Error: Product already exists!')
    }
    const newElectronic = await database.electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronic Error')
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')
    return newProduct
  }
  async updateProduct(productId: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const bodyUpdate = this
    if (bodyUpdate.product_attributes) {
      //update child
      await updateProductById({ productId, bodyUpdate: this.product_attributes, model: database.electronic })
    }
    const updateProduct = await super.updateProduct(productId, bodyUpdate)
    return updateProduct
  }
}

class Furniture extends Product {
  async createProduct(): Promise<any> {
    const checkExits = await existingProduct({
      productName: this.product_name,
      productShop: this.product_shop
    })

    if (checkExits) {
      throw new ConFlictRequestError('Error: Product already exists!')
    }
    const newFurniture = await database.furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new Electronic Error')
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')
    return newProduct
  }
  async updateProduct(productId: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const bodyUpdate = this
    if (bodyUpdate.product_attributes) {
      //update child
      await updateProductById({ productId, bodyUpdate: this.product_attributes, model: database.furniture })
    }
    const updateProduct = await super.updateProduct(productId, bodyUpdate)
    return updateProduct
  }
}
const productFactory = new ProductFactory()
export { productFactory }
