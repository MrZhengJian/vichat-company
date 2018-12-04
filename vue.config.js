const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  lintOnSave: false,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: { colors: true },
    proxy: {//192.168.1.135:8080     47.104.186.84
      // 匹配代理的url
      '/vc': {
        // 目标服务器地址
        'Access-Control-Allow-Origin':'*',
        target: 'http://47.104.186.84',
        // 路径重写
        pathRewrite: {'^/vc': '/vc'},
        changeOrigin: true
      },
      '/vcapi': {
        // 目标服务器地址
        'Access-Control-Allow-Origin':'*',
        target: 'http://47.104.186.84',
        // 路径重写
        pathRewrite: {'^/vcapi': '/vcapi'},
        changeOrigin: true
      }
    }
  }

}
