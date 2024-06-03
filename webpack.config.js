const path = require('path');

module.exports = {
  mode: 'none', // Use 'development' or 'production'.
  entry: './src/extension.ts', // Point to your main file.
  target: 'node', // VS Code extensions run in a Node.js-context.
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js', // The output bundle.
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode', // The vscode-module is created on-the-fly and must be excluded.
  },
  resolve: {
    extensions: ['.ts', '.js'], // Support ts-files and js-files.
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  devtool: 'source-map',
};