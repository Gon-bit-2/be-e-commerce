'use strict'
import { model, Schema, Types } from 'mongoose'

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'
export interface IComment extends Document {
  comment_productId: Types.ObjectId
  comment_userId: number
  comment_content: string
  comment_left: number
  comment_right: number
  comment_parentId: Types.ObjectId
  isDeleted: boolean
}
const commentSchema = new Schema<IComment>(
  {
    comment_productId: { type: Schema.Types.ObjectId, required: true },
    comment_userId: {
      type: Number,
      default: 1
    },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const commentModel = model<IComment>(DOCUMENT_NAME, commentSchema)
export default commentModel
