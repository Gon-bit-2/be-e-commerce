import crypto from 'crypto'
import 'dotenv/config'
import database from '~/db/database'

const generateApiKey = async () => {
  const newKey = crypto.randomBytes(64).toString('hex')
  const apiKey = await database.apiKey.create({ key: newKey, permissions: '0000', status: true })

  console.log('=================================')
  console.log('API Key đã được tạo thành công!')
  console.log('Key:', apiKey.key)
  console.log('=================================')
}

generateApiKey().catch(console.error)
export { generateApiKey }
