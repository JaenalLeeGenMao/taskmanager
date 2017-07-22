var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

var config = {
    entry: ['babel-polyfill', './app/index.js'],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index_bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|jpe?g|gif)(\?\S*)?$/, loader: 'url-loader?limit=200000'}
        ]
    },
    devtool: 'sourcemap',
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin ({
            template: 'app/index.html'
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  )
}

module.exports = config;
