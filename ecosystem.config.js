// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopDev-be',
      script: './src/index.ts', // <-- Trỏ thẳng vào file .ts
      interpreter: './node_modules/.bin/tsx', // <-- Dùng tsx để chạy
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
}
