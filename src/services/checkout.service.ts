'use strict'

import database from '~/db/database'
import { BadRequestError } from '~/middleware/error.middleware'
import { checkProductByServer, findCartId } from '~/model/repositories/cart.repo'
import discountService from '~/services/discount.service'
import redisService from '~/services/redis.service'
export interface ProductItem {
  price: number
  quantity: number
  productId: string
}
interface ShopDiscount {
  shopId: string
  discountId: string // Giả sử bạn có discountId
  codeId: string // Giả sử codeId chính là discount_code
}
interface ShopOrder {
  shopId: string
  shop_discounts: ShopDiscount[] // Giữ nguyên any nếu cấu trúc chưa rõ
  item_products: ProductItem[]
}

interface CheckoutPayload {
  cartId: string
  userId: string
  shop_order_ids: ShopOrder[]
}
interface OrderPayload extends CheckoutPayload {
  user_address: any
  user_payment: any
}
class CheckoutService {
  /*
  {
    cartId,
    userId,
    shop_order_ids: [
    {
     shopId,
     productId,
     shop_discounts:[],
     item_products:[
          {
            price,
            quantity,
            productId  
          }    
                 ]
    }
                   ]  
  },
  {
     shopId,
     productId,
     shop_discount:[
             {
               shopId,
               discountId,
               codeId          
             }      
                   ],
     item_products:[
          {
            price,
            quantity,
            productId  
          }    
                 ]
    }
                   ]  
  }
  */
  async checkoutPreview({ cartId, userId, shop_order_ids }: CheckoutPayload) {
    const foundCart = await findCartId(cartId)
    if (!foundCart) {
      throw new BadRequestError('Cart does not exist')
    }
    const checkout_order = {
        totalPrice: 0, //tổng tiền hàng
        freeShip: 0, //tiền ship
        totalDiscount: 0, //tổng tiền giảm
        totalCheckout: 0 //tổng tiền trả
      },
      shop_order_ids_new = []
    //
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
      //
      const checkProductServer = await checkProductByServer(item_products)
      if (!checkProductServer) {
        throw new BadRequestError('order wrong!!')
      }
      //tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        const itemTotal = (product?.quantity || 0) * (product?.price || 0)
        return acc + itemTotal
      }, 0)
      //tổng tiền trc xử lý
      checkout_order.totalPrice = +checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }
      //nếu shop_discounts ton tai >0, check xem hop le
      if (shop_discounts.length > 0) {
        //1 discount
        //get amount discount
        const { totalPrice = 0, discount = 0 } = await discountService.getDiscountAmount({
          discount_code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })
        //tong tien discount giam gia
        checkout_order.totalDiscount += discount
        //neu tien giam gia > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }
      //tong thanh toan
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
  //order
  async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }: OrderPayload) {
    const { shop_order_ids_new, checkout_order } = await checkoutService.checkoutPreview({
      cartId,
      userId,
      shop_order_ids
    })

    //check co vuot ton kho khong
    //get new array product
    const products = shop_order_ids_new.flatMap((order) => order.item_products)
    console.log('[1]', products)
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await redisService.acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await redisService.releaseLock(keyLock, cartId)
      }
    }
    //check neu co 1 san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Sản phẩm được cập nhập, vui lòng quay lại giỏ hàng')
    }
    const newOrder = await database.order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })
    //nếu insert success thi xóa product in cart
    if (newOrder) {
      //
    }
    return newOrder
  }
  /* Query Order [User] */
  async getOrderByUser() {}
  /* Query Order usesing ID [User] */
  async getOneOrderByUser() {}
  /* cancel Order [User] */
  async cancelOrderByUser() {}
  /* update Order [User|Admin] */
  async updateOrderByStatusByShop() {}
}
const checkoutService = new CheckoutService()
export default checkoutService
