import database from '~/db/database'
import { comparePassword, hashPassword } from '~/utils/hashPassword'
import crypto from 'crypto'
import keyTokenService from '~/services/keyToken.service'
import { createTokenPair } from '~/utils/auth'
import { getInfoData } from '~/utils/info'
import { AuthFailureError, BadRequestError } from '~/middleware/error.middleware'
import { findEmailById } from '~/services/shop.service'
interface ISignUp {
  name: string
  email: string
  password: string
  roles: string
}
enum RoleShop {
  SHOP,
  WRITER,
  EDITOR,
  ADMIN
}
class AccessService {
  sigUp = async ({ name, email, password }: ISignUp) => {
    const holderShop = await database.shop.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error:Shop already registered')
    }
    const newShop = await database.shop.create({
      name,
      email,
      password: await hashPassword(password),
      roles: RoleShop.SHOP
    })
    if (newShop) {
      //create private key and public key
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey })
      //lưu vào db
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id.toString(),
        publicKey,
        privateKey
      })
      console.log('Key Store>>>>', keyStore)

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKey error'
        }
      }

      //create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
      console.log(`create token successfully`, tokens)
      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }
    }
    return {
      code: 200,
      metadata: null
    }
  }
  login = async ({ email, password, refreshToken = null }: any) => {
    const foundShop = await findEmailById({ email })
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }
    const isMatch = await comparePassword(password, foundShop.password)
    if (!isMatch) throw new AuthFailureError('Authentication Error')
    //
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const tokens = await createTokenPair({ userId: foundShop._id }, publicKey, privateKey)
    await keyTokenService.createKeyToken({
      userId: foundShop._id.toString(),
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken
    })
    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }
}

const accessService = new AccessService()
export default accessService
