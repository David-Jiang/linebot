var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getEntry = () => {
    let paths = glob.sync('src/**/*.js');
    let arr = [
        'babel-polyfill',
        'webpack/hot/dev-server',
        'webpack/hot/only-dev-server'
    ];
    paths.forEach(function (path) {
        arr.push('./' + path.split('.')[0]);
    });

    return arr;
};


module.exports = {
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    // Server Configuration options
    devServer: {
        contentBase: './', // Relative directory for base of server
        devtool: 'eval',
        hot: true, // Live-reload
        inline: true,
        port: 3000, // Port Number
        host: 'localhost', // Change to '0.0.0.0' for external facing server
    },
    entry: getEntry(),
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: [nodeModulesPath],
            options: {
                presets: ['es2015', 'stage-0', 'react']
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader!'
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new CleanWebpackPlugin(['build'])
    ],
    stats: {
        // Nice colored output
        colors: true
    },

};

//module.exports = config;
