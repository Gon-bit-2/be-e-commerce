'use strict'

import { model, Schema, Types } from 'mongoose'
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
export interface IInventory extends Document {
  inven_productId: Types.ObjectId
  inven_location: string
  inven_stock: number
  inven_shopId: Types.ObjectId
  inven_reservation: string[]
}
const inventorySchema = new Schema<IInventory>(
  {
    inven_productId: {
      type: Schema.ObjectId,
      required: true,
      ref: 'Product'
    },
    inven_location: {
      type: String,
      default: 'unKnow'
    },
    inven_stock: { type: Number, required: true },
    inven_shopId: {
      type: Schema.ObjectId,
      required: true,
      ref: 'Shop'
    },
    inven_reservation: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const InventoryModel = model(DOCUMENT_NAME, inventorySchema)
export default InventoryModel
