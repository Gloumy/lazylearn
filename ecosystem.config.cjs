module.exports = {
  apps: [
    {
      name: 'lazylearn',
      script: '.output/server/index.mjs',
      node_args: '--env-file=.env.production',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 3002,
      },
    },
  ],
}
