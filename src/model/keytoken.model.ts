'use strict'

import { model, Schema, Types } from 'mongoose'
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
export interface IKeyToken extends Document {
  userId: Types.ObjectId
  publicKey: string
  privateKey: string
  refreshTokensUsed: string[]
  refreshToken: string
}
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
    refreshTokensUsed: {
      type: [String],
      default: []
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema)
export default keyTokenModel
