'use strict'
import { Types } from 'mongoose'
import database from '~/db/database'

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

export { insertInventory }
