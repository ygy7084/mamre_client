
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    context : resolve(__dirname, 'src'),
    entry : [
        'babel-polyfill',
        'whatwg-fetch',
        'react',
        'react-dom',
        './index.js'],
    output : {
        path: resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders : [
            {
                test: /\.js$/,
                loaders : ['babel-loader?'+JSON.stringify({
                    cacheDirectory : true,
                    presets : ['es2015', 'react']
                })],
                exclude:/node_modules/
            },
            {
                test: /\.css$/,
                loader : 'style!css-loader'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};