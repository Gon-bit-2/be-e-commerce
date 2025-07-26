'use strict'
import { model, Schema, Document } from 'mongoose'

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'
export interface IApiKey {
  key: string
  status: boolean
  permissions: string[]
}
const apiKeySchema = new Schema<IApiKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Schema.Types.Boolean,
      default: false
    },
    permissions: {
      type: [String],
      enum: ['0000', '1111', '2222'],
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const apiKeyModel = model(DOCUMENT_NAME, apiKeySchema)
export default apiKeyModel
