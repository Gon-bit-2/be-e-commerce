'use strict'
const STATUS_CODE = {
  OK: 200,
  CREATE: 201
}
const REASON_STATUS_CODE = {
  OK: 'Success',
  CREATE: 'Created'
}
interface ISuccessResponse {
  message?: string
  responseStatusCode?: string
  statusCode?: number
  metadata?: any
}

class SuccessResponse {
  message: string
  responseStatusCode: string
  statusCode: number
  metadata: any
  constructor({
    message,
    responseStatusCode = REASON_STATUS_CODE.OK,
    statusCode = STATUS_CODE.OK,
    metadata = {}
  }: ISuccessResponse) {
    this.message = !message ? responseStatusCode : message
    this.responseStatusCode = responseStatusCode
    this.statusCode = statusCode
    this.metadata = metadata
  }
  send(res: any, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata = {} }: ISuccessResponse) {
    super({ message, metadata, statusCode: STATUS_CODE.OK })
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.CREATE,
    responseStatusCode = REASON_STATUS_CODE.CREATE,
    metadata
  }: ISuccessResponse) {
    super({ message, statusCode, responseStatusCode, metadata })
  }
}

export { OK, CREATED, SuccessResponse }
