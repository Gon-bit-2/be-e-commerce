'use strict'

import { NextFunction, RequestHandler, Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
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

  login = async (req: Request, res: Response) => {
    const handleLogin = await accessService.login(req.body)
    new SuccessResponse({
      metadata: handleLogin
    }).send(res)
  }

  logout = async (req: Request, res: Response) => {
    const handleLogout = await accessService.logout(req.keyStore)
    new SuccessResponse({
      message: 'Logout success',
      metadata: handleLogout
    }).send(res)
  }
}

const accessController = new AccessController()
export default accessController
