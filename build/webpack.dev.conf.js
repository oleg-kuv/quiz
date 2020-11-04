const webpack = require ('webpack')
const merge = require ('webpack-merge')
const baseWebPackConfig = require ('./webpack.base.config')
const devWebpackConfig = merge (baseWebPackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: baseWebPackConfig.externals.paths.dist,
    port: 8050,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin ({
      filename: '[file].map'
    })
  ]
})
module.exports = new Promise ((resolve, reject) => {
  resolve(devWebpackConfig)
})
