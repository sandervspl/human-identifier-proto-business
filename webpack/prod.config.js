const _ = require('lodash');
const base = require('./base.config.js');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = _.assign({}, base, {
  module: _.assign({}, base.module, {
    loaders: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          emitErrors: true,
          typeCheck: true,
        }
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0']
        },
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?importLoaders=1!postcss',
        }),
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?importLoaders=1!stylus-loader',
        }),
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(gif|png|jpe?g|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  }),

  plugins: _.union(base.plugins, [
    ...base.plugins,
    new ExtractTextPlugin('style.css'),
  ]),
});
