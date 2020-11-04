const merge = require ('webpack-merge')
const baseWebPackConfig = require ('./webpack.base.config')
const buildWebpackConfig = merge (baseWebPackConfig, {
  mode: 'production',
  plugins: []
})
module.exports = new Promise ((resolve, reject) => {
  resolve(buildWebpackConfig)
})