'use strict'

import { model, Schema, Types } from 'mongoose'
import { ProductItem } from 'src/services/checkout.service'
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'delivered'
export interface IOrder extends Document {
  order_userId: number
  order_checkout: Record<string, any>
  order_shipping: Record<string, any>
  order_payment: Record<string, any>
  order_products: any[]
  order_trackingNumber: OrderStatus
}
const orderSchema = new Schema<IOrder>(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*{
    totalPrice,
    totalApplyDiscount,
    freeShip
    } */
    order_shipping: { type: Object, default: {} },
    /*
  {
  street,
  city,
  state,
  country
  } 
  */
    order_payment: { type: Object, default: {} },
    order_products: { type: Schema.Types.Mixed, required: true },
    order_trackingNumber: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const orderModel = model<IOrder>(DOCUMENT_NAME, orderSchema)
export default orderModel
