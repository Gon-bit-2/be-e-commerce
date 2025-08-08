'use strict'

import database from '~/db/database'
import { convertToObjectIdMongo } from '~/utils'

/*
- Feature Comment
+add comment user [user | shop]
*/
interface ICreateComment {
  productId: string
  userId: number
  content: string
  parentCommentId: string | null
}
class CommentService {
  async createComment({ productId, userId, content, parentCommentId = null }: ICreateComment) {
    const comment = await database.comment.create({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })
    let rightValue
    if (parentCommentId) {
      //reply comment
    } else {
      const maxRightValue = await database.comment.findOne(
        {
          comment_productId: convertToObjectIdMongo(productId)
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      )
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }
    //insert comment
    comment.comment_left = rightValue as number
    comment.comment_right = (rightValue as number) + 1

    await comment.save()
    return comment
  }
}

const commentService = new CommentService()
export default commentService
