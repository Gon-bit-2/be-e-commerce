import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { asyncHandle } from '~/helpers/asyncHandle'
import { AuthFailureError, NotFoundError } from '~/middleware/error.middleware'
import keyTokenService from '~/services/keyToken.service'
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}
const createTokenPair = async (payload: any, publicKey: string, privateKey: string) => {
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
const authentication = asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new AuthFailureError('Invalid Request')
  //
  const keyStore = await keyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not Found keyStore')
  console.log('Check keyStore>>>:', keyStore)
  //verify token
  const authHeader = req.headers[HEADER.AUTHORIZATION] as string
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthFailureError('Invalid Request')
  }

  // Tách lấy token
  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) throw new AuthFailureError('Invalid Request')
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey) as { userId: string }
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
    console.log('Check decodeUser>>>:', decodeUser)
    req.keyStore = keyStore
    return next()
  } catch (error) {
    if (error instanceof Error)
      if (error.name === 'TokenExpiredError') {
        throw new AuthFailureError('Token expired. Please relogin.')
      }
    // Các lỗi khác như `JsonWebTokenError` sẽ bị bắt ở đây
    throw new AuthFailureError('Invalid Token')
  }
})
const verifyJWT = async (token: string, keySecret: string) => {
  return await jwt.verify(token, keySecret)
}
export { createTokenPair, authentication, verifyJWT }
