// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'shopDev-be',
      script: 'dist/index.js', // chạy file build JS
      cwd: '/home/ubuntu/actions-runner/_work/be-e-commerce/be-e-commerce',
      exec_mode: 'cluster',
      interpreter: 'node', // QUAN TRỌNG: dùng node, không phải bun
      // node_args: '',                        // không cần nếu chạy dist/*
      env: { NODE_ENV: 'production' }
    }
  ]
}
