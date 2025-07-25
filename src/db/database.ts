import mongoose from 'mongoose'
import 'dotenv/config'
import { countConnection } from '~/helpers/check.connect'
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shopdev.iphmauu.mongodb.net/`
class Database {
  constructor() {
    this.connect()
  }
  async connect() {
    try {
      await mongoose.connect(uri)
      countConnection()
      console.log(`Connected MongoDB successfully`)
    } catch (error) {
      console.log('Connected Failed ', error)
    }
  }
}
const database = new Database()
export default database
