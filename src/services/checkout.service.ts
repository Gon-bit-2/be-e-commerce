'use strict'

import database from '~/db/database'
import { BadRequestError } from '~/middleware/error.middleware'
import { checkProductByServer, findCartId } from '~/model/repositories/cart.repo'
import discountService from '~/services/discount.service'
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
}
const checkoutService = new CheckoutService()
export default checkoutService
