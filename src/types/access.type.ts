interface ISignUp {
  name: string
  email: string
  password: string
  roles: string
}
interface IKeyStore {
  _id: string
  userId: string
  privateKey: string
  publicKey: string
  refreshToken: string
  refreshTokensUsed: string[]
}
enum RoleShop {
  SHOP,
  WRITER,
  EDITOR,
  ADMIN
}

export { ISignUp, RoleShop, IKeyStore }
