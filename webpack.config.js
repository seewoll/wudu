const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./src/config.js')
const sample = require('./src/config.sample.js')

const base = {
  entry: {
    build: './src/',
  },

  output: {
    publicPath: '/',
    path: '/',
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.js'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      config: JSON.stringify(config),
    }),
  ],

  devServer: {
    disableHostCheck: true,
    noInfo: true,
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [
        {
          from: 'favicon.ico',
          to: './src/assets/favicon.ico',
        },
        {
          from: 'promise.js',
          to: './src/assets/promise.js',
        },
      ],
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  devtool: 'cheap-module-eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  base.module.rules[0] = {
    test: /\.css$/,
    loader: ['style-loader', 'css-loader', 'postcss-loader'],
  }
  base.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: true,
      output: { comments: false },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.npm.html',
      template: './src/index.html',
      config: '$config',
      minify: {
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        collapseWhitespace: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      config: JSON.stringify(sample),
      minify: {
        removeComments: false,
        minifyJS: false,
        minifyCSS: true,
        collapseWhitespace: false,
      },
    }),
  ]
  base.devtool = 'source-map'
  base.output = {
    path: `${__dirname}/dist`,
    publicPath: '',
    filename: '[name].[chunkhash:8].js',
  }
}

module.exports = base
