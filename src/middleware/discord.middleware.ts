'use strict'

import { NextFunction, Request, Response } from 'express'
import loggerService from '~/loggers/discord.log'

const pushToLogDiscord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    loggerService.sendToFormatCode({
      title: `Method ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')} ${req.originalUrl}`
    })
    return next()
  } catch (error) {
    next(error)
  }
}

export { pushToLogDiscord }
