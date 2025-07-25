import mongoose from 'mongoose'
import 'dotenv/config'
import { countConnection } from '~/helpers/check.connect'
import shopModel from '~/model/shop.model'
import keyTokenModel from '~/model/keytoken.model'
import apiKeyModel from '~/model/apikey.model'
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shopdev.iphmauu.mongodb.net/shopDEV` //
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
  get shop() {
    return shopModel
  }
  get token() {
    return keyTokenModel
  }
  get apiKey() {
    return apiKeyModel
  }
}
const database = new Database()
export default database
