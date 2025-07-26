'use strict'

import { NextFunction, Request, Response } from 'express'
import apiKeyService from '~/services/apiKey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    const objKey = await apiKeyService.findById(key as string)
    if (!objKey) {
      res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    //tồn tại thì gán vào req
    req.objKey = objKey
    return next()
  } catch (error) {
    console.log(error)
  }
}
const permission = (permission: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      res.status(403).json({
        message: 'permissions denied'
      })
    }
    console.log('permission:', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      res.status(403).json({
        message: 'permissions denied'
      })
    }
    return next()
  }
}
export { apiKey, permission }
