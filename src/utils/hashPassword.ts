import bcrypt from 'bcrypt'
const saltRounds = 10
const hashPassword = async (plaintext: string) => {
  return await bcrypt.hash(plaintext, saltRounds)
}
const comparePassword = async (plaintext: string, hashPassword: string) => {
  return await bcrypt.compare(plaintext, hashPassword)
}

export { hashPassword, comparePassword }
