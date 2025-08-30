'use strict'
import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'
cloudinary.config({
  cloud_name: 'be-shopdev',
  api_key: '896546616314426',
  api_secret: process.env.CLOUDINARY_SECRET
})
console.log(cloudinary.config)
export default cloudinary
