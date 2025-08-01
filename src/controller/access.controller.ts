'use strict'

import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import accessService from '~/services/access.service'

class AccessController {
  signup = async (req: Request, res: Response) => {
    // console.log('[P]::signup::', req.body)
    const handleSignUp = await accessService.sigUp(req.body)
    new SuccessResponse({
      message: 'Sign Up Success',
      metadata: handleSignUp
    }).send(res)
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

  handlerRefreshToken = async (req: Request, res: Response) => {
    const handleGetToken = await accessService.handlerRefreshToken({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore
    })
    new SuccessResponse({
      message: 'Get token success',
      metadata: handleGetToken
    }).send(res)
  }
}

const accessController = new AccessController()
export default accessController
