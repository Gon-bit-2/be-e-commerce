import database from '~/db/database'
import { comparePassword, hashPassword } from '~/utils/hashPassword'
import crypto from 'crypto'
import keyTokenService from '~/services/keyToken.service'
import { createTokenPair, verifyJWT } from '~/utils/auth'
import { getInfoData } from '~/utils/info'
import { AuthFailureError, BadRequestError, ForbiddenError } from '~/middleware/error.middleware'
import { findByEmail } from '~/services/shop.service'
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
  logout = async (keyStore: any) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id)
    console.log('delete key >>>', delKey)

    return delKey
  }
  handlerRefreshToken = async (refreshToken: string) => {
    /*
    checktoken used
    */
    //check token đã được sử dụng chưa
    const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
    if (foundToken) {
      //decode xem là ai
      const { userId, email } = (await verifyJWT(refreshToken, foundToken.privateKey)) as {
        userId: string
        email: string
      }
      console.log('check decode verify>>', { userId, email })
      //có thì xóa token khỏi keyStore
      await keyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls reLogin')
    }
    //không có, quá ngon
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
    console.log('check holderShop>>', holderToken)

    if (!holderToken) {
      throw new AuthFailureError('Shop not registered 1')
    }
    //verify token
    const { userId, email } = (await verifyJWT(refreshToken, holderToken.privateKey)) as {
      userId: string
      email: string
    }
    //check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new AuthFailureError('Shop not registered 2')
    }
    //create token mới
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    //update
    await holderToken.updateOne({
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
