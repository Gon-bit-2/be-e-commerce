// src/routes/discount/index.ts

'use strict'
import express from 'express'

import inventoryController from '~/controller/inventory.controller'
import { authenticationV2 } from '~/utils/auth'

const router = express.Router()

router.use(authenticationV2)
router.post('', inventoryController.addStockToInventory)

export default router
