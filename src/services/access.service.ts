import database from '~/db/database'
import { hashPassword } from '~/utils/hashPassword'
import crypto from 'crypto'
import keyTokenService from '~/services/keyToken.service'
import { createTokenPair } from '~/utils/auth'
import { getInfoData } from '~/utils/info'
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
  sigUp = async ({ name, email, password, roles }: ISignUp) => {
    try {
      const holderShop = await database.shop.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registered'
        }
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
        const keyStore = await keyTokenService.createKeyToken({
          userId: newShop._id.toString(),
          publicKey,
          privateKey
        })

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
    } catch (error) {
      return {
        code: 'xxx',
        message: error,
        status: 'error'
      }
    }
  }
}

const accessService = new AccessService()
export default accessService
