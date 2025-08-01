/*
-add product to cart 
-reduce product quantity
-increase product quantity
-get cart
-delete cart
-delete cart item 
*/

import database from '~/db/database'
import { NotFoundError } from '~/middleware/error.middleware'
import { getProductById } from '~/model/repositories/product.repo'

class CartService {
  async createUserCart({ userId, product }: { userId: string; product: any }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_product: product
        }
      },
      options = { upsert: true, new: true }

    return await database.cart.findOneAndUpdate(query, updateOrInsert, options)
  }
  async updateUserCartQuantity({ userId, product }: { userId: string; product: any }) {
    const { productId, quantity } = product
    const query = { cart_userId: userId, 'cart_product.productId': productId, cart_state: 'active' },
      updateSet = {
        $inc: {
          'cart_product.$.quantity': quantity
        }
      },
      options = { upsert: true, new: true }

    return await database.cart.findOneAndUpdate(query, updateSet, options)
  }
  async addToCart({ userId, product }: { userId: string; product: any }) {
    const userCart = await database.cart.findOne({ cart_userId: userId })
    if (!userCart) {
      //create
      return await cartService.createUserCart({ userId, product })
    }
    //nếu có giỏ hàng nhưng 0 sản phẩm
    if (!userCart.cart_count_product) {
      userCart.cart_product = [product]
      return await userCart.save()
    }
    //giỏ hàng tồn tại và có sản phẩm r thì update quantity
    return await cartService.updateUserCartQuantity({ userId, product })
  }
  //update
  /*
  shop_order_id:[
    {
     shopId,
     item_product:[
                   {
                     quantity,
                     price,
                     shopId,
                     old_quantity,
                     productId
                    }
                  ]
    version
    }
  ]
  */
  async updateToCart({ userId, shop_order_ids }: any) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
    //
    const foundProduct = await getProductById(productId)
    if (!foundProduct) {
      throw new NotFoundError('Not Found Product')
    }
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }
    if (quantity === 0) {
      //delete
    }
    return await cartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }
  async deleteUserCart({ userId, productId }: any) {
    console.log({ userId, productId })

    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_product: {
            productId
          }
        }
      }
    const deleteCart = await database.cart.updateOne(query, updateSet)
    return deleteCart
  }
  async getListUserCart(userId: string) {
    return await database.cart
      .findOne({
        cart_userId: +userId
      })
      .lean()
  }
}
const cartService = new CartService()
export default cartService
