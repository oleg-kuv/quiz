const path = require ('path')
const fs = require ('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require ('copy-webpack-plugin')
const HtmlWebpackPlugin = require ('html-webpack-plugin')
let PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
}

const PAGES_DIR = `${PATHS.src}/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

const PUG_PAGES_DIR = `${PATHS.src}/pug/pages/`
const PUG_PAGES = fs.readdirSync(PUG_PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
     externals: {
          paths: PATHS,
     },
     entry: {
          app: PATHS.src
     },
     output: {
          filename: `${PATHS.assets}js/[name].js`,
          path: PATHS.dist ,
          //publicPath: '/'
     },
     module: {
          rules:[{
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    exclude: '/node_modules/',
                    query: {
                        pretty: true
                    }
               },{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: '/node_modules/'
               },{
                    test: /\.scss$/,
                    use: ['style-loader', 
                           MiniCssExtractPlugin.loader, 
                           {
                              loader: 'css-loader',
                              options: {sourceMap: true,  url: false}
                           },
                           {
                              loader: 'postcss-loader',
                              options: {sourceMap: true, config: {path: `${PATHS.src}/js/postcss.config.js`}}
                           }, 
                           {
                              loader: 'sass-loader',
                              options: {sourceMap: true}
                           }],
               },{
                    test: /\.css$/,
                    use: ['style-loader', 
                           MiniCssExtractPlugin.loader, 
                           {
                              loader: 'css-loader',
                              options: {sourceMap: true, url: false}
                           },
                           {
                              loader: 'postcss-loader',
                              options: {sourceMap: true, config: {path: `${PATHS.src}/js/postcss.config.js`}}
                           }, 
                    ],
               },
               {
                    test: /\.(jpe?g|gif|jpg|png|svg|woff|woff2|wav|mp3)$/i,
                    loader: 'file-loader',  
                    options: {
                      name: '[name].[ext]'
                    }              
               },
          ]
     },
     plugins: [
          new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
          }),
          ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page}`,
            minify: false
          })),
          ...PUG_PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PUG_PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`,
            minify: false
          })),
          new CopyWebpackPlugin([
            {from: `${PATHS.src}/img`, to: `${PATHS.assets}img`},
            {from: `${PATHS.src}/font`, to: `${PATHS.assets}font`},
            //{from: `${PATHS.src}/static`, to: ``},
          ])
     ],
}
