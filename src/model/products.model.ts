'use strict'

import { model, Schema } from 'mongoose'
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
const productSchema = new Schema(
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
const clothingSchema = new Schema(
  {
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
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String
  },
  {
    timestamps: true,
    collection: 'electronics'
  }
)

const productModel = model(DOCUMENT_NAME, productSchema)
const clothingModel = model('Clothing', clothingSchema)
const electronicModel = model('Electronic', electronicSchema)
export { productModel, clothingModel, electronicModel }
