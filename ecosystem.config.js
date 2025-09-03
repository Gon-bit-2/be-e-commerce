// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopDev-be',
      script: './dist/index.js', // Đường dẫn tới file JS sau khi build
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1.5G'
    }
  ]
}
