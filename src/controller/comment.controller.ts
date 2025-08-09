'use strict'

import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import commentService from '~/services/comment.service'

class CommentController {
  createComment = async (req: Request, res: Response) => {
    // console.log('[P]::signup::', req.body)
    const newComment = await commentService.createComment(req.body)

    new SuccessResponse({
      message: 'Create Comment Success',
      metadata: newComment
    }).send(res)
  }
  getComment = async (req: Request, res: Response) => {
    const Comment = await commentService.getCommentsByParentId({
      productId: req.query.productId as string,
      parentCommentId: req.query.parentCommentId as string
    })

    new SuccessResponse({
      message: 'get Comment  Success',
      metadata: Comment
    }).send(res)
  }
  deleteComment = async (req: Request, res: Response) => {
    const Comment = await commentService.deleteComment(req.body)

    new SuccessResponse({
      message: 'get Comment  Success',
      metadata: Comment
    }).send(res)
  }
}

const commentController = new CommentController()
export default commentController
