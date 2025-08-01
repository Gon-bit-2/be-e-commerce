import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { asyncHandle } from '~/helpers/asyncHandle'
import { AuthFailureError, NotFoundError } from '~/middleware/error.middleware'
import keyTokenService from '~/services/keyToken.service'
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'refreshtoken'
}
interface IPayLoad {
  userId: Types.ObjectId
  email: string
}
const createTokenPair = async (payload: IPayLoad, publicKey: string, privateKey: string) => {
  const accessToken = await jwt.sign(payload, publicKey, {
    expiresIn: '2d'
  })
  const refreshToken = await jwt.sign(payload, privateKey, {
    expiresIn: '7d'
  })
  //
  jwt.verify(accessToken, publicKey, (err, decoded) => {
    if (err) {
      console.error(`error verify`, err)
    } else {
      console.log(`decoded verify`, decoded)
    }
  })
  return {
    accessToken,
    refreshToken
  }
}

const authenticationV2 = asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new AuthFailureError('Invalid Request')
  //
  const keyStore = await keyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not Found keyStore')
  console.log('Check keyStore>>>:', keyStore)

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      //xử phần lấy lại cặp key
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      if (!refreshToken || Array.isArray(refreshToken)) throw new AuthFailureError('REFRESHTOKEN IN VALID')
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
      if (typeof decodeUser !== 'object' || !decodeUser.userId) {
        throw new AuthFailureError('Invalid Token Payload')
      }
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
      req.user = decodeUser
      req.keyStore = keyStore
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      if (error instanceof Error)
        if (error.name === 'TokenExpiredError') {
          throw new AuthFailureError('Token expired. Please relogin.')
        }
      // Các lỗi khác như `JsonWebTokenError` sẽ bị bắt ở đây
      throw new AuthFailureError('Invalid Token')
    }
  }
  //verify token
  const authHeader = req.headers[HEADER.AUTHORIZATION] as string
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthFailureError('Invalid Request')
  }

  // Tách lấy token
  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) throw new AuthFailureError('Invalid Request')
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
    if (typeof decodeUser !== 'object' || !decodeUser.userId) {
      throw new AuthFailureError('Invalid Token Payload')
    }
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')

    // Gán thông tin vào request và gọi next()
    req.user = decodeUser
    req.keyStore = keyStore
    return next()
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new AuthFailureError('Token expired. Please relogin.')
    }
    throw new AuthFailureError('Invalid Token')
  }
})
const verifyJWT = async (token: string, keySecret: string) => {
  return await jwt.verify(token, keySecret)
}
export { createTokenPair, verifyJWT, authenticationV2 }
