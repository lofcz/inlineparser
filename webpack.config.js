const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'inlineparser.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
        name: 'InlineParser',
        type: 'var',
        export: "InlineParser"
    }
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: [ '.ts', '.js' ],
    fallback: {
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer")
    }
},
};