import database from '~/db/database'
import { comparePassword, hashPassword } from '~/utils/hashPassword'
import crypto from 'crypto'
import keyTokenService from '~/services/keyToken.service'
import { createTokenPair } from '~/utils/auth'
import { getInfoData } from '~/utils/info'
import { AuthFailureError, BadRequestError, ForbiddenError } from '~/middleware/error.middleware'
import { findByEmail } from '~/services/shop.service'
import e from 'express'
// import { generateApiKey } from '~/utils/generateApikey'
import { IKeyStore, ISignUp, RoleShop } from '~/types/access.type'

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
      //apikey

      //create private key and public key
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey })
      //create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
      //lưu vào db
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id.toString(),
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })
      console.log('Key Store>>>>', keyStore)

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKey error'
        }
      }

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
    // 1. Tìm shop dựa trên email
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop chưa được đăng ký')

    // 2. So khớp mật khẩu
    const isMatch = await comparePassword(password, foundShop.password)
    if (!isMatch) throw new AuthFailureError('Sai thông tin xác thực')

    // 3. Tạo privateKey và publicKey mới
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4. Tạo cặp token mới
    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

    // 5. Lưu hoặc cập nhật key store với thông tin mới
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
  logout = async (keyStore: IKeyStore) => {
    // console.log('check keystore', keyStore._id)

    const delKey = await keyTokenService.removeKeyById(keyStore._id)
    console.log('delete key >>>', delKey)

    return delKey
  }
  handlerRefreshToken = async ({ refreshToken, user, keyStore }: any) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls reLogin')
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered 1')
    }

    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new AuthFailureError('Shop not registered 2')
    }

    //create token mới
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
    //update
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken //đã sử dụng lấy token mới nên add vô phần đã sử dụng
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }
}

const accessService = new AccessService()
export default accessService
