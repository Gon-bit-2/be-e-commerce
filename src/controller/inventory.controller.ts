'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import inventoryService from '~/services/inventory.service'

class InventoryController {
  addStockToInventory = async (req: Request, res: Response) => {
    // console.log('[P]::signup::', req.body)
    const handleAddStockToInventory = await inventoryService.addStockToInventory(req.body)
    new SuccessResponse({
      message: 'Create new cart handleAddStockToInventory',
      metadata: handleAddStockToInventory
    })
  }
}

const inventoryController = new InventoryController()
export default inventoryController
