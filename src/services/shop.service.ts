import database from '~/db/database'

const findByEmail = async ({
  email,
  select = {
    name: 1,
    password: 1,
    email: 1,
    status: 1,
    roles: 1
  }
}: any) => {
  return await database.shop.findOne({ email }).select(select)
}
export { findByEmail }
