const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postStylus = require('poststylus');

module.exports = {
  devtool: 'source-map',

  entry: path.resolve(__dirname, '..', 'src/app.ts'),

  output: {
    path: path.resolve(__dirname, '..', 'public'),
    publicPath: '',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json', 'styl'],
    alias: {
      assets: path.resolve(__dirname, '../src/assets/'),
      interfaces: path.resolve(__dirname, '../src/game/interfaces'),
      speed: path.resolve(__dirname, '../src/game/speed'),
      movement: path.resolve(__dirname, '../src/game/movement'),
    }
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          emitErrors: false,
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
        loader: 'style-loader!css-loader?importLoaders=1!postcss'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader?importLoaders=1!stylus-loader'
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
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ]
          })
        ],
        postStylus: [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9', // React doesn't support IE8 anyway
            ]
          })
        ]
      }
    })
  ]
};