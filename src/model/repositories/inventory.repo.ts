'use strict'
import { Types } from 'mongoose'
import database from '~/db/database'
import { convertToObjectIdMongo } from '~/utils'

const insertInventory = async ({
  productId,
  shopId,
  productStock,
  productLocation = 'unKnow'
}: {
  productId: Types.ObjectId
  shopId: Types.ObjectId
  productStock: number
  productLocation?: any
}) => {
  return await database.inventories.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: productStock,
    inven_location: productLocation
  })
}
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongo(productId),
      inven_stock: { $gte: quantity }
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date()
        }
      }
    },
    options = { upsert: true, new: true }
  return await database.inventories.updateOne(query, updateSet)
}
export { insertInventory, reservationInventory }
