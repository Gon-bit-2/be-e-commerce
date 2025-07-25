import express from 'express'
import 'dotenv/config'
const app = express()
const port = process.env.PORT_SERVER || 3000
app.listen(port, () => {
  console.log('BE E-Commerce Server is running ')
})
