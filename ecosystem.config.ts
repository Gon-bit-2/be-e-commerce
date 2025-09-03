module.exports = {
  apps: [
    {
      name: 'shopDev-be',
      script: 'dist/index.js',
      node_args: '--require tsconfig-paths/register',
      cwd: '/home/ubuntu/actions-runner/_work/be-e-commerce/be-e-commerce', // <== cập nhật đúng path repo của bạn
      env: { NODE_ENV: 'production' }
    }
  ]
}
