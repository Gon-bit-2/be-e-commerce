'use strict'
import mongoose from 'mongoose'
import os from 'os'
const _SECONDS = 5000
//check connection
const countConnection = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connection::${numConnection} `)
}
//check overload
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length //lấy số core của máy
    const memoryUsage = process.memoryUsage().rss //check số memmory đã sử dụng
    //example maximum
    const maxConnection = numCores * 5
    console.log(`Active connections ${numConnection}`)
    console.log(`Memmory Usage ${memoryUsage / 1024 / 1024} MB`)
    if (numConnection > maxConnection) {
      console.log('Connect OverLoad Detected')
    }
  }, _SECONDS) //monitor every 5 seconds
}
export { countConnection, checkOverLoad }
