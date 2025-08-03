import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import 'dotenv/config'
import database from '~/db/database'
import router from '~/routes'
import redisService from '~/services/redis.service'

const app = express()
const PORT = process.env.PORT_SERVER || 3000
// eslint-disable-next-line @typescript-eslint/no-require-imports
//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression()) //giảm khối lượng phải vận chuyển đến client
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//init db
database.connect()
//init redis
redisService.initRedis()
//init routes
app.use('/', router)

//handle error
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found')
  res.status(404).json({
    error
  })
})
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500
  console.error(error.stack || error)
  // loggerService.sendToMessage(`Error: ${error.message}, Status: ${statusCode}, URL: ${req.originalUrl}`)
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})
//
const server = app.listen(PORT, () => {
  console.log(`BE E-Commerce Server is running with port ${PORT} `)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exits Server Express'))
  redisService.closeRedis() // <-- Thêm dòng này
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exits Server Express'))
})
