'use strict'

import database from '~/db/database'
import crypto from 'crypto'
class ApiKey {
  async createApiKey() {
    const newKey = crypto.randomBytes(64).toString('hex')
    const apiKey = await database.apiKey.create({ key: newKey, permissions: '0000' })
    console.log('API_KEY>>', apiKey)

    return apiKey
  }
  async findById(key: string) {
    const objKey = await database.apiKey.findOne({ key, status: true }).lean()
    return objKey
  }
}

const apiKeyService = new ApiKey()
export default apiKeyService
