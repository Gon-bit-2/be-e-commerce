'use strict'

import database from '~/db/database'
import { BadRequestError } from '~/middleware/error.middleware'
import { getProductById } from '~/model/repositories/product.repo'

class InventoryService {
  async addStockToInventory({ stock, productId, shopId, location = '30 Văn Chung,Hồ Chí Minh' }) {
    const product = await getProductById(productId)
    if (!product) {
      throw new BadRequestError('the product does not exists')
    }
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      },
      options = { upsert: true, new: true }
    return await database.inventories.findOneAndUpdate(query, updateSet, options)
  }
}

const inventoryService = new InventoryService()
export default inventoryService
