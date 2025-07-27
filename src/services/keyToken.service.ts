import database from '~/db/database'
interface IKey {
  userId: string
  publicKey: string
  privateKey: string
  refreshToken?: string
}
class KeyTokenService {
  async createKeyToken({ userId, publicKey, privateKey, refreshToken }: IKey) {
    try {
      const filter = { userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }
      const tokens = await database.token.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}
const keyTokenService = new KeyTokenService()
export default keyTokenService
