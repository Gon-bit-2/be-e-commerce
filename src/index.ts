import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import 'dotenv/config'
import database from '~/db/database'
import { countConnection } from '~/helpers/check.connect'
const app = express()
const PORT = process.env.PORT_SERVER || 3000

//middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression()) //giảm khối lượng phải vận chuyển đến client

//init db
database.connect()
//init routes

//handle error

//
const server = app.listen(PORT, () => {
  console.log(`BE E-Commerce Server is running with port ${PORT} `)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exits Server Express'))
})
