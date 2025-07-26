'use strict'
const STATUS_CODE = {
  FORBIDDEN: 403,
  CONFLICT: 409
}
const REASON_STATUS_CODE = {
  FORBIDDEN: 'Bed Request Error',
  CONFLICT: 'CONFLICT Error'
}
class ErrorResponse extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
class ConFlictRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.FORBIDDEN, statusCode = STATUS_CODE.FORBIDDEN) {
    super(message, statusCode)
  }
}
const badRequestError = new BadRequestError()
const conFlictRequestError = new ConFlictRequestError()
export { BadRequestError, ConFlictRequestError }
