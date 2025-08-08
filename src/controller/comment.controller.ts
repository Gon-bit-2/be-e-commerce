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
}

const commentController = new CommentController()
export default commentController
