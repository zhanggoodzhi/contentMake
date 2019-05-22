module.exports = {
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'
      }
    // devServer: {
    //     proxy: 'http://10.0.200.112:8012/'
    // }
}