'use strict'
import express, { Request, Response } from 'express'
import accessRouter from './access'
import productRouter from './product'
import discountRouter from './discount'
import cartRouter from './cart'
import checkoutRouter from './checkout'
import inventoryRouter from './inventory'
import commentRouter from './comment'
import uploadRouter from './upload'
import notificationRouter from './notification'
import { apiKey, permission } from '~/utils/checkAuth'
import { pushToLogDiscord } from '~/middleware/discord.middleware'

const router = express.Router()
router.get('/checkstatus', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Check status success'
  })
})
//push log to discord
router.use(pushToLogDiscord)

//check apikey
router.use(apiKey)
//check permission
router.use(permission('0000'))
router.use('/v1/api/discount', discountRouter)
router.use('/v1/api/cart', cartRouter)
router.use('/v1/api/product/', productRouter)
router.use('/v1/api/checkout', checkoutRouter)
router.use('/v1/api/inventory', inventoryRouter)
router.use('/v1/api/comment', commentRouter)
router.use('/v1/api/notification', notificationRouter)
router.use('/v1/api/upload', uploadRouter)

router.use('/v1/api', accessRouter)

export default router
