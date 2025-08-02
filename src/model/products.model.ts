'use strict'

import { model, Schema, Types } from 'mongoose'
import slugify from 'slugify'
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
export type ProductType = 'Electronics' | 'Clothing' | 'Furniture'
export interface IClothingAttributes {
  brand: string
  size: string
  material: string
}

export interface IElectronicAttributes {
  manufacturer: string
  model: string
  color: string
}

export interface IFurnitureAttributes {
  brand: string
  size: string
  material: string
}

// 2. Tạo một kiểu Union cho tất cả các loại attributes
export type TProductAttributes = IClothingAttributes | IElectronicAttributes | IFurnitureAttributes
export interface IProduct<T = TProductAttributes> {
  product_name: string
  product_thumb: string
  product_description?: string // Thuộc tính này là tùy chọn (không có "required: true")
  product_slug: string
  product_price: number
  product_quantity: number
  product_type: ProductType // Sử dụng kiểu đã định nghĩa ở trên
  product_shop: Types.ObjectId
  product_attributes: T // Schema.Types.Mixed có thể được biểu diễn bằng "any"
  product_ratingAverage: number
  product_variation: any[]
  isDraft: boolean
  isPublished: boolean
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
export interface IFurniture {
  product_shop: Types.ObjectId
  brand: string
  size: string
  material: string
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
    product_slug: { type: String },
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
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      //làm tròn
      set: (val: number) => Math.round(val * 10) / 10
    },
    product_variation: [],
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
//Document middleware: run before save and created
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})
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
const furnitureSchema = new Schema<IFurniture>(
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
const furnitureModel = model<IFurniture>('Furniture', furnitureSchema)
export { productModel, clothingModel, electronicModel, furnitureModel }
