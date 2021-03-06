const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: 'node',
  externals: [/aws-sdk/],
  module: {
  },
  resolve: {
    extensions: ['.js']
  }
}
