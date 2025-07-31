'use strict'

import { model, Schema, Types } from 'mongoose'
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
export interface IDiscount extends Document {
  discount_name: string
  discount_description: string
  discount_type: string
  discount_value: number
  discount_code: string
  discount_start_date: Date
  discount_end_date: Date
  discount_max_uses: number
  discount_uses_count: number
  discount_users_used: string[]
  discount_max_uses_per_user: number
  discount_min_order_value: number
  discount_shopId: Types.ObjectId
  discount_is_active: boolean
  discount_applies_to: string
  discount_product_ids: string[]
}
const discountSchema = new Schema<IDiscount>(
  {
    discount_name: { type: String, required: true },
    discount_description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      required: true,
      default: 'fixed_amount' // or percentage
    },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, //luot dung toi da ,
    discount_uses_count: { type: Number, required: true }, //so luong discount da su dung ,
    discount_users_used: { type: [String], default: [] }, //ai la nguoi su dung
    discount_max_uses_per_user: { type: Number, required: true }, //so luong discount cho phep moi user su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, enum: ['all', 'specific'], required: true },
    discount_product_ids: { type: [String], default: [] } //so san pham duoc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const discountModel = model<IDiscount>(DOCUMENT_NAME, discountSchema)
export default discountModel
