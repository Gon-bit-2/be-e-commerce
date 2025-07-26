import database from '~/db/database'
interface IKey {
  userId: string
  publicKey: string
  privateKey: string
}
class KeyTokenService {
  async createKeyToken({ userId, publicKey, privateKey }: IKey) {
    try {
      const tokens = await database.token.create({
        userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}
const keyTokenService = new KeyTokenService()
export default keyTokenService
