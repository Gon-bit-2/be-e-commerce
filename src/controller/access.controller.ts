'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import accessService from '~/services/access.service'

class AccessController {
  signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // console.log('[P]::signup::', req.body)
    const handleSignUp = await accessService.sigUp(req.body)
    res.status(201).json({
      code: '20001',
      handleSignUp
    })
  }
}

const accessController = new AccessController()
export default accessController
