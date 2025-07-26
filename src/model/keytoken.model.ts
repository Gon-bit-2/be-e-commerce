'use strict'

import { model, Schema } from 'mongoose'
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
const keyTokenSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: { type: String, required: true },
    refreshToken: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema)
export default keyTokenModel
