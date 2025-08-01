import { IKeyToken } from '~/model/keytoken.model'

type ApiKeyObject = any

declare module 'express-serve-static-core' {
  interface Request {
    objKey?: ApiKeyObject
    keyStore?: any
    user?: any
    refreshToken?: any
  }
}
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    //make optional so when you try to decode stuff other than user it will show it can be undefined
    userId?: Types.ObjectId
    email?: string
  }
}
