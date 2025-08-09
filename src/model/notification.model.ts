'use strict'
import { model, Schema, Types } from 'mongoose'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'
/*
ORDER-001:order successfully
ORDER-002:order failed
PROMOTION-001: new PROMOTION
SHOP-001: new product by user 
*/
export interface INotification extends Document {
  noti_type: string
  noti_senderId: Schema.Types.ObjectId
  noti_receiveId: number
  noti_content: string
  noti_options: object
}
const notificationSchema = new Schema<INotification>(
  {
    noti_type: {
      type: String,
      enum: ['SHOP-001', 'ORDER-001', 'ORDER-002', 'PROMOTION-001'],
      required: true
    },
    noti_senderId: { type: Schema.Types.ObjectId, required: true },
    noti_receiveId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const notificationModel = model<INotification>(DOCUMENT_NAME, notificationSchema)
export default notificationModel
