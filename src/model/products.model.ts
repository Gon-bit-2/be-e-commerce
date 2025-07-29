'use strict'

import { model, Schema, Types } from 'mongoose'
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
export type ProductType = 'Electronics' | 'Clothing' | 'Furniture'

export interface IProduct {
  product_name: string
  product_thumb: string
  product_description?: string // Thuộc tính này là tùy chọn (không có "required: true")
  product_price: number
  product_quantity: number
  product_type: ProductType // Sử dụng kiểu đã định nghĩa ở trên
  product_shop: Types.ObjectId
  product_attributes: any // Schema.Types.Mixed có thể được biểu diễn bằng "any"
}
export interface IClothing {
  product_shop: Types.ObjectId
  brand: string
  size: string
  material: string
}
export interface IElectronic {
  product_shop: Types.ObjectId
  manufacturer: string
  model: string
  color: string
}
const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: {
      type: String
    },
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//
const clothingSchema = new Schema<IClothing>(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    brand: { type: String, required: true },
    size: String,
    material: String
  },
  {
    timestamps: true,
    collection: 'clothes'
  }
)

//
const electronicSchema = new Schema<IElectronic>(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    manufacturer: { type: String, required: true },
    model: String,
    color: String
  },
  {
    timestamps: true,
    collection: 'electronics'
  }
)
const furnitureSchema = new Schema<IClothing>(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    brand: { type: String, required: true },
    size: String,
    material: String
  },
  {
    timestamps: true,
    collection: 'furniture'
  }
)
const productModel = model<IProduct>(DOCUMENT_NAME, productSchema)
const clothingModel = model<IClothing>('Clothing', clothingSchema)
const electronicModel = model<IElectronic>('Electronic', electronicSchema)
const furnitureModel = model('Furniture', furnitureSchema)
export { productModel, clothingModel, electronicModel, furnitureModel }
