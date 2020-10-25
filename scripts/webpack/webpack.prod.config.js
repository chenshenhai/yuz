process.env.NODE_ENV = 'production';

const { merge } = require('webpack-merge');
const config = require('./webpack.base.config');

module.exports = merge(config, {
  mode: 'production',
  // devtool: '#source-map'
});