'use strict'

import { model, Schema } from 'mongoose'
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
export interface ICart extends Document {
  cart_state: string
  cart_product: any
  cart_count_product: number
  cart_userId: number
}
const cartSchema = new Schema<ICart>(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    cart_product: {
      type: Array,
      required: true,
      default: []
    },
    cart_count_product: {
      type: Number,
      default: 0
    },
    cart_userId: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const cartModel = model<ICart>(DOCUMENT_NAME, cartSchema)
export default cartModel
