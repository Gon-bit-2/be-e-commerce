
type ApiKeyObject = any

declare namespace Express {
  export interface Request {
    objKey?: ApiKeyObject
  }
}
