const _ = require('lodash');
const base = require('./base.config.js');
const path = require('path');

module.exports = _.assign({}, base, {
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'public'),
    inline: true
  },
})
