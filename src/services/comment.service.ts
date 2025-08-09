'use strict'

import database from '~/db/database'
import { NotFoundError } from '~/middleware/error.middleware'
import { findProduct } from '~/model/repositories/product.repo'
import { convertToObjectIdMongo } from '~/utils'

/*
- Feature Comment
+add comment user [user | shop]
+ get list of comment [user | shop]
+ delete a comment [user | shop | admin]
*/
interface ICreateComment {
  comment_productId: string
  comment_userId: number
  comment_content: string
  comment_parentId: string | null
}
class CommentService {
  async createComment({ comment_productId, comment_userId, comment_content, comment_parentId = null }: ICreateComment) {
    const comment = await database.comment.create({
      comment_productId: comment_productId,
      comment_userId: comment_userId,
      comment_content: comment_content,
      comment_parentId: comment_parentId
    })
    let rightValue
    if (comment_parentId) {
      //reply comment
      const parentComment = await database.comment.findById(comment_parentId)
      if (!parentComment) throw new NotFoundError(`Comment not found `)
      rightValue = parentComment.comment_right
      //update
      await database.comment.updateMany(
        {
          comment_productId: convertToObjectIdMongo(comment_productId),
          comment_right: { $gte: rightValue }
        },
        {
          $inc: { comment_right: 2 }
        }
      )
      //
      await database.comment.updateMany(
        {
          comment_productId: convertToObjectIdMongo(comment_productId),
          comment_left: { $gte: rightValue }
        },
        {
          $inc: { comment_left: 2 }
        }
      )
    } else {
      const maxRightValue = await database.comment.findOne(
        {
          comment_productId: convertToObjectIdMongo(comment_productId)
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
  async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0
  }: {
    productId: string
    parentCommentId: string | null
    limit?: number
    offset?: number
  }) {
    if (parentCommentId) {
      const parent = await database.comment.findById(parentCommentId)
      if (!parent) {
        throw new NotFoundError(`not found comment for product `)
      }
      const comments = await database.comment
        .find({
          comment_productId: convertToObjectIdMongo(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right }
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1
        })
        .sort({
          comment_left: 1
        })
      return comments
    }
    const comments = await database.comment
      .find({
        comment_productId: convertToObjectIdMongo(productId),
        comment_parentId: parentCommentId
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1
      })
      .sort({
        comment_left: 1
      })
    return comments
  }
  async deleteComment({ commentId, productId }: { commentId: string; productId: string }) {
    //check product exits
    const fondProduct = await findProduct({
      product_id: productId
    })
    if (!fondProduct) throw new NotFoundError('Product not found')
    const comment = await database.comment.findById(commentId)
    if (!comment) throw new NotFoundError('Comment not found')
    const leftValue = comment.comment_left
    const rightValue = comment.comment_right
    //2: tính width
    const width = rightValue - leftValue + 1
    //3:xóa tất cả comment id con
    await database.comment.deleteMany({
      comment_productId: convertToObjectIdMongo(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })
    //4: cập nhập giá trị left và right
    await database.comment.updateMany(
      {
        comment_productId: convertToObjectIdMongo(productId),
        comment_right: { $gt: rightValue }
      },
      {
        $inc: { comment_left: -width }
      }
    )
  }
}
const commentService = new CommentService()
export default commentService
