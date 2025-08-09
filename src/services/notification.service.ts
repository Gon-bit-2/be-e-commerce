'use strict'

import database from '~/db/database'

class NotificationService {
  pushNotiToSystem = async ({ type = 'SHOP-001', receivedId = 1, senderId = '1', options = {} }) => {
    let noti_content
    if (type === 'SHOP-001') {
      noti_content = `@@@ vừa thêm một sản phẩm: @@@@`
    } else if (type === 'PROMOTION-001') {
      noti_content = `@@@ vừa thêm một voucher: @@@@`
    }
    const newNoti = await database.notification.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receiveId: receivedId,
      noti_options: options
    })
    return newNoti
  }
  listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
    const match = { noti_receiveId: userId }
    if (type !== 'ALL') {
      match['noti_type'] = type
    }
    console.log('Check match>>>>>>', match)

    return await database.notification.aggregate([
      { $match: match },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          note_receivedId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ['$noti_options.shope_name', 0, -1]
              },
              {
                $substr: ['$noti_options.product_name', 0, -1]
              }
            ]
          },
          createAt: 1,
          noti_options: 1
        }
      }
    ])
  }
}
const notificationService = new NotificationService()
export default notificationService
