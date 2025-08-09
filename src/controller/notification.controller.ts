'use strict'
import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'

import notificationService from '~/services/notification.service'

class NotificationController {
  async getListNotiByUser(req: Request, res: Response) {
    const listNoti = await notificationService.listNotiByUser(req.query)
    new SuccessResponse({ message: 'get list noti success', metadata: listNoti }).send(res)
  }
}

const notificationController = new NotificationController()
export default notificationController
