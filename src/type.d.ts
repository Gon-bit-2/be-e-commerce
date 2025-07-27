import { IKeyToken } from '~/model/keytoken.model'

type ApiKeyObject = any

declare module 'express-serve-static-core' {
  interface Request {
    objKey?: ApiKeyObject
    keyStore?: any
  }
}
