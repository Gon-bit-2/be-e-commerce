'use strict'

import { reasonPhrases } from '~/utils/reasonPhrases'
import { statusCodes } from '~/utils/statusCodes'

class ErrorResponse extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
class ConFlictRequestError extends ErrorResponse {
  constructor(message = reasonPhrases.CONFLICT, statusCode = statusCodes.CONFLICT) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = reasonPhrases.FORBIDDEN, statusCode = statusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = reasonPhrases.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message = reasonPhrases.NOT_FOUND, statusCode = statusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = reasonPhrases.FORBIDDEN, statusCode = statusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}
class RedisErrorResponse extends ErrorResponse {
  constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, statusCode = statusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }
}
export { BadRequestError, ConFlictRequestError, AuthFailureError, NotFoundError, ForbiddenError, RedisErrorResponse }
