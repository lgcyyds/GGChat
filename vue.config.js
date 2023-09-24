const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    port: 7878,
    client: {
      webSocketURL: 'ws://0.0.0.0:7878/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
})
module.exports = {
  lintOnSave: false,

}
