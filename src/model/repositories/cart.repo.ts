'use strict'

import database from '~/db/database'
import { getProductById } from '~/model/repositories/product.repo'
import { ProductItem } from '~/services/checkout.service'
import { convertToObjectIdMongo } from '~/utils'

const findCartId = async (cartId: string) => {
  return await database.cart.findOne({ _id: convertToObjectIdMongo(cartId), cart_state: 'active' })
}
const checkProductByServer = async (products: ProductItem[]) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId)
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId
        }
      }
    })
  )
}

export { findCartId, checkProductByServer }
